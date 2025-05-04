// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleAmm {
    IERC20 public immutable tokenA;
    IERC20 public immutable tokenB;
    uint256 public reserveA;
    uint256 public reserveB;
    uint256 public totalShares;
    mapping(address => uint256) public shares;

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function getReserves() external view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }

    /// @notice returns amount out given amount in and direction
    function getAmountOut(uint256 amountIn, bool isAToB) public view returns (uint256) {
        (uint256 rIn, uint256 rOut) = isAToB ? (reserveA, reserveB) : (reserveB, reserveA);
        require(rIn > 0 && rOut > 0, "No liquidity");
        uint256 amountInWithFee = amountIn * 997 / 1000;
        return (amountInWithFee * rOut) / (rIn * 1000 / 1000 + amountInWithFee);
    }

    /// @notice swap exact `amountIn`, require at least `minOut`, direction by `isAToB`
    function swap(uint256 amountIn, uint256 minOut, bool isAToB) external returns (uint256 amountOut) {
        require(amountIn > 0, "Zero in");
        (IERC20 inTok, IERC20 outTok, uint256 rIn, uint256 rOut) = isAToB
            ? (tokenA, tokenB, reserveA, reserveB)
            : (tokenB, tokenA, reserveB, reserveA);

        // transfer in
        require(inTok.transferFrom(msg.sender, address(this), amountIn), "Transfer in failed");

        // compute out
        uint256 amountInWithFee = amountIn * 997 / 1000;
        amountOut = (amountInWithFee * rOut) / (rIn + amountInWithFee);
        require(amountOut >= minOut, "Slippage");

        // update reserves
        if (isAToB) {
            reserveA += amountIn;
            reserveB -= amountOut;
        } else {
            reserveB += amountIn;
            reserveA -= amountOut;
        }

        // send out
        require(outTok.transfer(msg.sender, amountOut), "Transfer out failed");
    }

    /// @notice provide liquidity in ratio, mints shares
    function addLiquidity(uint256 amountA, uint256 amountB) external returns (uint256 minted) {
        if (totalShares == 0) {
            minted = sqrt(amountA * amountB);
        } else {
            minted = min(
                (amountA * totalShares) / reserveA,
                (amountB * totalShares) / reserveB
            );
        }
        require(minted > 0, "Insufficient");
        require(tokenA.transferFrom(msg.sender, address(this), amountA), "A in");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "B in");

        reserveA += amountA;
        reserveB += amountB;
        totalShares += minted;
        shares[msg.sender] += minted;
    }

    /// @notice burn shares, return tokens
    function removeLiquidity(uint256 share) external returns (uint256 outA, uint256 outB) {
        require(share > 0 && shares[msg.sender] >= share, "Bad share");
        outA = (reserveA * share) / totalShares;
        outB = (reserveB * share) / totalShares;

        shares[msg.sender] -= share;
        totalShares -= share;
        reserveA -= outA;
        reserveB -= outB;

        require(tokenA.transfer(msg.sender, outA), "A out");
        require(tokenB.transfer(msg.sender, outB), "B out");
    }

    function min(uint256 x, uint256 y) internal pure returns (uint256) { return x < y ? x : y; }
    function sqrt(uint y) internal pure returns (uint z) {
        if (y > 3) {
            z = y;
            uint x = y / 2 + 1;
            while (x < z) { z = x; x = (y / x + x) / 2; }
        } else if (y != 0) {
            z = 1;
        }
    }
}