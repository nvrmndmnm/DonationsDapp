task("donate", "Donates specified amount of wei from the address to the contract")
    .addParam("address", "Sender address")
    .addParam("amount", "Wei amount to send")
    .setAction(async (taskArgs) => {
        const donationsContract = await ethers.getContractAt("Donations", process.env.CONTRACT_ADDRESS);
        const signer = await donationsContract.provider.getSigner(taskArgs.address);
        await donationsContract.connect(signer).donate({ value: taskArgs.amount });
        console.log(`Donated ${taskArgs.amount} wei from ${taskArgs.address}.`);
    });
task("redeem", "Sends specified amount of wei from the contract to the address")
    .addParam("address", "Receiver address")
    .addParam("amount", "Wei amount to send")
    .setAction(async (taskArgs) => {
        const donationsContract = await ethers.getContractAt("Donations", process.env.CONTRACT_ADDRESS);
        await donationsContract.redeemDonations(taskArgs.address, {value: (taskArgs.amount)});
        console.log(`Redeemed ${taskArgs.amount} wei to ${taskArgs.address}.`);
    });
task("donators", "Prints list of all donators")
    .setAction(async () => {
        const donationsContract = await ethers.getContractAt("Donations", process.env.CONTRACT_ADDRESS);
        console.log(await donationsContract.getDonators());
    });
task("donations-sum", "Prints sum of donated ETH from the specified address")
    .addParam("address", "Donator address")
    .setAction(async (taskArgs) => {
        const donationsContract = await hre.ethers.getContractAt("Donations", process.env.CONTRACT_ADDRESS);
        const sum = await donationsContract.getDonationsSumFromAddress(taskArgs.address);
        console.log(`${taskArgs.address} donated ${ethers.utils.formatEther(sum)} ETH.`);
    });
