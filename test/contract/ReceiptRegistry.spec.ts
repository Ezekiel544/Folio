import { expect } from "chai";
import hre from "hardhat";
import type { ReceiptRegistry } from "../../typechain-types";

const { ethers } = hre;

let registry: ReceiptRegistry;

describe("ReceiptRegistry", function () {
  let admin: string;
  let issuerAddress: string;
  let owner: string;
  let stranger: string;
  let otherIssuer: string;

  let issuerSigner: Awaited<ReturnType<typeof ethers.getSigners>>[1];

  const RECEIPT_ONE = ethers.encodeBytes32String("rcpt_abc123");
  const HASH_ONE = ethers.keccak256(ethers.toUtf8Bytes("signed-receipt-1"));
  const RECEIPT_TWO = ethers.encodeBytes32String("rcpt_def456");
  const HASH_TWO = ethers.keccak256(ethers.toUtf8Bytes("signed-receipt-2"));

  async function issueAs(signer: { address: string }, receiptId: string, hash: string, to: string) {
    const connected = registry.connect(signer as never) as unknown as ReceiptRegistry;
    return connected.issue(receiptId, hash, to);
  }

  before(async function () {
    const signers = await ethers.getSigners();
    admin = signers[0].address;
    issuerAddress = signers[1].address;
    owner = signers[2].address;
    stranger = signers[3].address;
    otherIssuer = signers[4].address;
    issuerSigner = signers[1];
    registry = (await ethers.deployContract("ReceiptRegistry", [
      issuerAddress,
    ])) as unknown as ReceiptRegistry;
  });

  describe("deployment", function () {
    it("sets the deployer as admin", async function () {
      expect(await registry.admin()).to.equal(admin);
    });

    it("whitelists the initial issuer", async function () {
      expect(await registry.issuers(issuerAddress)).to.equal(true);
    });

    it("does not whitelist arbitrary addresses", async function () {
      expect(await registry.issuers(stranger)).to.equal(false);
    });
  });

  describe("setIssuer", function () {
    it("allows the admin to toggle an issuer", async function () {
      await expect(registry.setIssuer(otherIssuer, true))
        .to.emit(registry, "IssuerUpdated")
        .withArgs(otherIssuer, true);
      expect(await registry.issuers(otherIssuer)).to.equal(true);
    });

    it("rejects non-admin callers", async function () {
      const signed = registry.connect(issuerSigner as never) as unknown as ReceiptRegistry;
      await expect(signed.setIssuer(otherIssuer, false)).to.be.revertedWith(
        "Only admin",
      );
    });

    it("allows the admin to revoke issuer status", async function () {
      await registry.setIssuer(otherIssuer, false);
      expect(await registry.issuers(otherIssuer)).to.equal(false);
    });
  });

  describe("issue", function () {
    it("only whitelisted issuers can issue", async function () {
      await expect(
        issueAs(await ethers.getSigner(stranger), RECEIPT_ONE, HASH_ONE, owner),
      ).to.be.revertedWith("Only issuer");
    });

    it("issues a proof for a valid receipt", async function () {
      await expect(issueAs(issuerSigner, RECEIPT_ONE, HASH_ONE, owner))
        .to.emit(registry, "ReceiptIssued")
        .withArgs(RECEIPT_ONE, HASH_ONE, owner, issuerAddress);
      const proof = await registry.get(RECEIPT_ONE);
      expect(proof.exists).to.equal(true);
      expect(proof.receiptHash).to.equal(HASH_ONE);
      expect(proof.issuer).to.equal(issuerAddress);
      expect(proof.owner).to.equal(owner);
      expect(proof.revoked).to.equal(false);
      expect(proof.issuedAt).to.be.greaterThan(0n);
    });

    it("rejects duplicate receipts", async function () {
      await expect(
        issueAs(issuerSigner, RECEIPT_ONE, HASH_TWO, owner),
      ).to.be.revertedWith("Receipt already exists");
    });
  });

  describe("transfer", function () {
    before(async function () {
      await issueAs(issuerSigner, RECEIPT_TWO, HASH_TWO, owner);
    });

    it("allows the current owner to transfer", async function () {
      const signed = registry.connect(await ethers.getSigner(owner)) as unknown as ReceiptRegistry;
      await expect(signed.transfer(RECEIPT_TWO, stranger))
        .to.emit(registry, "ReceiptTransferred")
        .withArgs(RECEIPT_TWO, owner, stranger);
      expect((await registry.get(RECEIPT_TWO)).owner).to.equal(stranger);
    });

    it("rejects non-owners", async function () {
      const signed = registry.connect(issuerSigner as never) as unknown as ReceiptRegistry;
      await expect(signed.transfer(RECEIPT_TWO, owner)).to.be.revertedWith(
        "Only owner",
      );
    });

    it("rejects unknown receipts", async function () {
      const signed = registry.connect(issuerSigner as never) as unknown as ReceiptRegistry;
      await expect(
        signed.transfer(ethers.encodeBytes32String("rcpt_unknown"), owner),
      ).to.be.revertedWith("Receipt not found");
    });
  });

  describe("revoke", function () {
    let revokable: string;
    before(async function () {
      revokable = ethers.encodeBytes32String("rcpt_revoke");
      await issueAs(issuerSigner, revokable, HASH_ONE, owner);
    });

    it("allows the owner to revoke", async function () {
      const signed = registry.connect(await ethers.getSigner(owner)) as unknown as ReceiptRegistry;
      await expect(signed.revoke(revokable))
        .to.emit(registry, "ReceiptRevoked")
        .withArgs(revokable, owner);
      expect((await registry.get(revokable)).revoked).to.equal(true);
    });

    it("rejects unknown receipts", async function () {
      await expect(
        registry.revoke(ethers.encodeBytes32String("rcpt_nope")),
      ).to.be.revertedWith("Receipt not found");
    });
  });

  describe("transfer after revoke", function () {
    let revoked: string;
    before(async function () {
      revoked = ethers.encodeBytes32String("rcpt_revoked2");
      await issueAs(issuerSigner, revoked, HASH_TWO, owner);
      const signed = registry.connect(await ethers.getSigner(owner)) as unknown as ReceiptRegistry;
      await signed.revoke(revoked);
    });

    it("blocks transferring a revoked receipt", async function () {
      const signed = registry.connect(await ethers.getSigner(owner)) as unknown as ReceiptRegistry;
      await expect(signed.transfer(revoked, stranger)).to.be.revertedWith(
        "Receipt revoked",
      );
    });
  });

  describe("revoke authorization", function () {
    let guarded: string;
    before(async function () {
      guarded = ethers.encodeBytes32String("rcpt_guarded");
      await issueAs(issuerSigner, guarded, HASH_ONE, owner);
    });

    it("rejects unauthorized revocations", async function () {
      const signed = registry.connect(await ethers.getSigner(stranger)) as unknown as ReceiptRegistry;
      await expect(signed.revoke(guarded)).to.be.revertedWith("Not authorized");
    });

    it("allows the admin to revoke", async function () {
      await expect(registry.revoke(guarded)).to.emit(registry, "ReceiptRevoked");
    });
  });
});