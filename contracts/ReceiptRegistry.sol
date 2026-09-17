// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Public proof and ownership layer for Folio portable receipts.
/// The complete receipt stays offchain; only its non-reversible hash is anchored here.
/// The registry is the canonical on-chain source of truth for:
///   - whether a receipt was ever issued (and by whom / to whom / when)
///   - the current owner according to the chain
///   - whether the receipt has been revoked
/// @dev The offchain receipt carries a signature so its full contents are verifiable;
///      this registry anchors the hash of the full signed receipt so it cannot be rewritten.
contract ReceiptRegistry {
    struct ReceiptProof {
        bytes32 receiptHash;
        address issuer;
        address owner;
        uint64 issuedAt;
        bool exists;
        bool revoked;
    }

    mapping(bytes32 => ReceiptProof) private receipts;
    mapping(address => bool) public issuers;
    address public admin;

    event ReceiptIssued(bytes32 indexed receiptId, bytes32 indexed receiptHash, address indexed owner, address issuer);
    event ReceiptTransferred(bytes32 indexed receiptId, address indexed from, address indexed to);
    event ReceiptRevoked(bytes32 indexed receiptId, address indexed by);
    event IssuerUpdated(address indexed issuer, bool allowed);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    modifier onlyIssuer() {
        require(issuers[msg.sender], "Only issuer");
        _;
    }

    constructor(address initialIssuer) {
        admin = msg.sender;
        issuers[initialIssuer] = true;
        emit IssuerUpdated(initialIssuer, true);
    }

    /// @notice Allow/deny an address as an approved receipt issuer.
    function setIssuer(address issuer, bool allowed) external onlyAdmin {
        issuers[issuer] = allowed;
        emit IssuerUpdated(issuer, allowed);
    }

    /// @notice Anchor a newly issued receipt. Only an approved issuer may call this.
    function issue(bytes32 receiptId, bytes32 receiptHash, address owner) external onlyIssuer {
        require(!receipts[receiptId].exists, "Receipt already exists");
        receipts[receiptId] = ReceiptProof(receiptHash, msg.sender, owner, uint64(block.timestamp), true, false);
        emit ReceiptIssued(receiptId, receiptHash, owner, msg.sender);
    }

    /// @notice Transfer ownership of a receipt on-chain. Only the current owner may call this.
    function transfer(bytes32 receiptId, address to) external {
        ReceiptProof storage receipt = receipts[receiptId];
        require(receipt.exists, "Receipt not found");
        require(!receipt.revoked, "Receipt revoked");
        require(receipt.owner == msg.sender, "Only owner");
        address from = receipt.owner;
        receipt.owner = to;
        emit ReceiptTransferred(receiptId, from, to);
    }

    /// @notice Revoke a receipt. The owner, the issuing business or the admin may do this.
    function revoke(bytes32 receiptId) external {
        ReceiptProof storage receipt = receipts[receiptId];
        require(receipt.exists, "Receipt not found");
        require(msg.sender == receipt.owner || msg.sender == receipt.issuer || msg.sender == admin, "Not authorized");
        receipt.revoked = true;
        emit ReceiptRevoked(receiptId, msg.sender);
    }

    /// @notice Read the on-chain proof for a receipt id.
    function get(bytes32 receiptId) external view returns (ReceiptProof memory) {
        return receipts[receiptId];
    }
}