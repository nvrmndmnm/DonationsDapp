const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe('Donations contract', function() {
    let Donations;
    let owner;
    let addr1;
    let addr2;
    let donationsContract;
    let provider = waffle.provider;

    beforeEach(async function() {
        Donations = await ethers.getContractFactory('Donations');
        [owner, addr1, addr2] = await ethers.getSigners();

        donationsContract = await Donations.deploy();
    });

    describe('Deployment', function () {
        it('Should set the right owner', async function () {
            expect(await donationsContract.owner()).to.equal(owner.address);
        });
        
        it('Should not have any donators history', async function () {
            const donators = await donationsContract.getDonators();
            
            expect(donators.length).to.equal(0);
        });
    });

    describe('Transactions', function () {
        it('Should accept donations', async function () {
            const contractOwnerInitialBalance = await provider.getBalance(owner.address);
            const donationETHValue = ethers.utils.parseEther('10');

            await donationsContract.connect(addr1).donate({value: donationETHValue});
            expect(await provider.getBalance(owner.address)).to.equal(contractOwnerInitialBalance.add(donationETHValue));
            expect(await donationsContract.getDonationsSumFromAddress(addr1.address)).to.equal(donationETHValue);
            expect(await donationsContract.getDonators()).to.include(addr1.address);
        });

        it('Should not accept empty donations', async function () {
            const contractOwnerInitialBalance = await provider.getBalance(owner.address);
            const donationETHValue = ethers.utils.parseEther('0');

            await expect(donationsContract.connect(addr1).donate({value: donationETHValue}))
                .to.be.revertedWith('Donation amount should be greater than zero.');
            expect(await provider.getBalance(owner.address)).to.equal(contractOwnerInitialBalance);
            expect(await donationsContract.getDonationsSumFromAddress(addr1.address)).to.equal(donationETHValue);
            expect(await donationsContract.getDonators()).not.to.include(addr1.address);
        });
          
        it('Should let the contract owner to redeem donations', async function () {
            const contractOwnerInitialBalance = await provider.getBalance(owner.address);
            const receiverInitialBalance = await provider.getBalance(addr2.address);
            const redemptionETHValue = ethers.utils.parseEther('1');

            const transaction = await donationsContract.connect(owner).redeemDonations(addr2.address, {value: redemptionETHValue});
            const receipt = await provider.getTransactionReceipt(transaction.hash);
            const totalCost = redemptionETHValue.add(receipt.gasUsed.mul(receipt.effectiveGasPrice));
            
            expect(await provider.getBalance(owner.address)).to.equal(contractOwnerInitialBalance.sub(totalCost));
            expect(await provider.getBalance(addr2.address)).to.equal(receiverInitialBalance.add(redemptionETHValue));
        });

        it('Should not let to redeem 0 from the account', async function () {
            const redemptionETHValue = ethers.utils.parseEther('0');

            await expect(donationsContract.connect(owner).redeemDonations(addr2.address, {value: redemptionETHValue}))
                .to.be.revertedWith('Redemption amount should be greater than zero.');
        });

        it('Should let to redeem by the contract owner only', async function () {
            const contractOwnerInitialBalance = await provider.getBalance(owner.address);
            const redemptionETHValue = ethers.utils.parseEther('1');

            await expect(donationsContract.connect(addr1).redeemDonations(addr2.address, {value: redemptionETHValue}))
                .to.be.revertedWith('Funds can only be redeemed by the contract owner.');
            expect(await provider.getBalance(owner.address)).to.equal(contractOwnerInitialBalance);
        });
    });
});