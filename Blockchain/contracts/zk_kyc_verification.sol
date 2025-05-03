// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @notice Interface for the zkPass verifier contract
interface zk_kyc_verification {
    function verifyProof(
        bytes calldata proof,
        bytes calldata inputs
    ) external view returns (bool);
}

/// @title ZKPassKYCRegistry
/// @notice Allows users to prove KYC status using a zkPass ZK proof
contract ZKPassKYCRegistry {
    zk_kyc_verification public verifier;

    mapping(address => bool) public isKYCed;

    event KYCVerified(address indexed user);

    constructor(address _verifier) {
        verifier = zk_kyc_verification(_verifier);
    }

    /// @notice Submit a ZK proof to verify KYC status.
    /// @param proof The zero-knowledge proof from zkPass.
    /// @param inputs The public inputs for the proof.
    function submitKYC(
        bytes calldata proof,
        bytes calldata inputs
    ) external {
        require(!isKYCed[msg.sender], "Already KYCed");
        require(
            verifier.verifyProof(proof, inputs),
            "Invalid ZK proof"
        );
        isKYCed[msg.sender] = true;
        emit KYCVerified(msg.sender);
    }

    function checkKYC(address user) external view returns (bool) {
        return isKYCed[user];
    }
}
