/*
    用于验证platON客户端项目的票池合约
*/
const Web3 = require('web3'),
    config = require('../config/config.76.json'),
    jsSHA = require('jssha');

const wallet = require('../l666.json'),
    abi = require('../abi/ticketContract.json'),
    getTransactionReceipt = require('../lib/getTransactionReceipt'),
    sign = require('../lib/sign'),
    password = 'aa123456'

const web3 = new Web3(new Web3.providers.HttpProvider(config.provider));
const balance = web3.eth.getBalance(wallet.address).toNumber();

console.log(`balance: %c ${web3.fromWei(balance)}`, "color:red");

const calcContract = web3.eth.contract(abi),
    ticketContract = calcContract.at(config.address.ticket);

/**
 * @description 购买选票，投票给候选人 发送交易的value为  购票数量 * 选票单价
 * @author liangyanxiang
 */
function voteTicket() {
    const
        count = 1,//购票数量
        price = 100000000000000000000,//选票单价 使用GetTicketPrice 接口查询当前票价
        nodeId = '0x0abaf3219f454f3d07b6cbcf3c10b6b4ccf605202868e2043b6f5db12b745df0604ef01ef4cb523adc6d9e14b83a76dd09f862e3fe77205d8ac83df707969b47'//候选人节点Id

    const data = ticketContract.VoteTicket.getPlatONData(count, price, nodeId, {
        transactionType: 1000//交易类型
    });

    const value = price * count

    const hash = web3.eth.sendRawTransaction(
        sign(wallet, password, getParams(data, value))
    );
    console.log('voteTicket hash', hash);
    getTransactionReceipt(hash, (code, data) => {
        console.log(code, data);
        let res = ticketContract.decodePlatONLog(data.logs[0]);
        if (res.length && res[0]) {
            res = JSON.parse(res[0]);
            if (res.ErrMsg == 'success') {
                if (res.Data) {
                    const arr = res.Data.split(':')
                    console.log(`成功选票的数量:${arr[0]},成交票价:${arr[1]}`)
                }
            } else {
                console.warn(`购买选票失败`);
            }
        } else {
            console.warn(`购买选票失败`);
        }
    });
}

/**
 * @description 获取票详情 废除
 * @author liangyanxiang
 * @returns
 */
function getTicketDetail() {
    console.log('getTicketDetail 废除')
    return
    const ticketId = "0x134fba852817b9da8508f4b7e82e792be05b90f2a288e52df17c10da0f303b65"//票Id

    const data = ticketContract.GetTicketDetail.getPlatONData(ticketId)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getTicketDetail:', result1);
    return result1
}

/**
 * @description 批量获取票详情 废除
 * @author liangyanxiang
 * @returns
 */
function getBatchTicketDetail() {
    console.warn('getBatchTicketDetail 废除')
    return
    const ticketIds = "0x134fba852817b9da8508f4b7e82e792be05b90f2a288e52df17c10da0f303b65:0x9d1078cb595b669dc37501c4a6ed5bf98732d15ec083f4ad102b677ce62d07dc:0x036809aaa312a4414ffc0bfe9cdd1dadd9fd54725e1d8305fea8b39a566506e5:0xb0144ebd80ee817902185da65c23daa16eeceb339125ce889841925e928963ad:0x80d8bab01789f512d9d8b060609009276bf0a6b101b19989c3946e51049708fb:0x861c9a791df9d03b54471f7fd21c9e996cbaf6f6f885e47f1a20f204156ada88:0x294b2baae5f9445363436ff2cffaeff63baf536c5d21fd17b25ba0f79c30aacb:0xc8d43bf85d4a9c63198439a6c282a0b308cbb0e2102493c34640afc998f3a1ef"//票Id列表 多张票的Id 通过:拼接 string

    const data = ticketContract.GetBatchTicketDetail.getPlatONData(ticketIds)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getBatchTicketDetail:', result1);
    return result1
}

/**
 * @description 获取指定候选人的选票Id的列表 废除
 * @author liangyanxiang
 */
function getCandidateTicketIds() {
    console.warn('getCandidateTicketIds 废除')
    return

    const nodeId = '0x4f6c8fd10bfb512793f81a3594120c76b6991d3d06c0cc652035cbfae3fcd7cdc3f3d7a82021dfdb9ea99f014755ec1a640d832a0362b47be688bb31d504f62d'//候选人节点Id

    const data = ticketContract.GetCandidateTicketIds.getPlatONData(nodeId)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getCandidateTicketIds result:', result1);
    return result1
}

/**
 * @description 批量获取指定候选人的选票Id的列表 废除
 * @author liangyanxiang
 */
function getBatchCandidateTicketIds() {
    console.warn('getBatchCandidateTicketIds 废除')
    return
    const nodeIds = '0x4f6c8fd10bfb512793f81a3594120c76b6991d3d06c0cc652035cbfae3fcd7cdc3f3d7a82021dfdb9ea99f014755ec1a640d832a0362b47be688bb31d504f62d:0x01d033b5b07407e377a3eb268bdc3f07033774fb845b7826a6b741430c5e6b719bda5c4877514e8052fa5dbc2f20fb111a576f6696b6a16ca765de49e11e0541'//多个nodeId通过":"拼接的字符串

    const data = ticketContract.GetBatchCandidateTicketIds.getPlatONData(nodeIds)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getBatchCandidateTicketIds result:', result1);
    return result1
}

/**
 * @description 获取指定候选人的票龄
 * @author liangyanxiang
 */
function getCandidateEpoch() {
    console.log('getCandidateEpoch')
    const nodeId = '0x0abaf3219f454f3d07b6cbcf3c10b6b4ccf605202868e2043b6f5db12b745df0604ef01ef4cb523adc6d9e14b83a76dd09f862e3fe77205d8ac83df707969b47'//候选人节点Id

    const data = ticketContract.GetCandidateEpoch.getPlatONData(nodeId)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getCandidateEpoch result:', result1);
    return result1
}

/**
 * @description 获取票池剩余票数量
 * @author liangyanxiang
 */
function getPoolRemainder() {
    console.log('getPoolRemainder')
    const data = ticketContract.GetPoolRemainder.getPlatONData()

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getPoolRemainder result:', result1.data);
    return result1
}

/**
 * @description 获取当前的票价
 * @author liangyanxiang
 */
function getTicketPrice() {
    console.log('getTicketPrice')

    const data = ticketContract.GetTicketPrice.getPlatONData()

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('getTicketPrice result:', result1.data);
    return result1
}

/**
 * @description (批量)获取指定候选人的有效选票数量
 * @author liangyanxiang
 */
function GetCandidateTicketCount() {
    console.log('GetCandidateTicketCount')
    const nodeIds = '0x0abaf3219f454f3d07b6cbcf3c10b6b4ccf605202868e2043b6f5db12b745df0604ef01ef4cb523adc6d9e14b83a76dd09f862e3fe77205d8ac83df707969b47:0xe0b6af6cc2e10b2b74540b87098083d48343805a3ff09c655eab0b20dba2b2851aea79ee75b6e150bde58ead0be03ee4a8619ea1dfaf529cbb8ff55ca23531ed'//多个nodeId通过":"拼接的字符串

    const data = ticketContract.GetCandidateTicketCount.getPlatONData(nodeIds)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('GetCandidateTicketCount result:', result1);
    return result1
}

/**
 * @description (批量)获取交易的有效选票数量
 * @author liangyanxiang
 */
function GetTicketCountByTxHash() {
    console.log('GetTicketCountByTxHash')
    const txHashs = '0x1e869a12c54dbab0889ab3588425bf1908956ec5fd757a457a8d4f16a2bd7b94:0x85414b7d2dfc20ee10318c2c5e39fbca4533bc26bac9b488f7fdcd447b5eace8'//多个txHash通过":"拼接的字符串

    const data = ticketContract.GetTicketCountByTxHash.getPlatONData(txHashs)

    const result = web3.eth.call({
        from: wallet.address,
        to: ticketContract.address,
        data: data,
    });

    const result1 = ticketContract.decodePlatONCall(result);
    console.log('GetTicketCountByTxHash result:', result1);
    return result1
}

/**
 * @description 获取发送sendRawTransaction的params
 * @author liangyanxiang
 * @date 2018-11-29
 * @param {string} [data='']
 * @param {string} [value="0x0"]
 * @returns
 */
function getParams(data = '', value = "0x0") {
    //nonce：sendTransaction可以不传，sendRowTransaction必须传
    const nonce = web3.eth.getTransactionCount(wallet.address);
    // value = web3.toHex(web3.toWei(value, 'ether'));
    value = web3.toHex(value)

    const params = {
        from: wallet.address,
        gasPrice: 22 * 10e9,
        gas: 0x1e8480,
        to: ticketContract.address,
        value,
        data,
        nonce
    }

    return params;
}



module.exports = {
    voteTicket,
    getTicketDetail,
    getBatchTicketDetail,
    getCandidateTicketIds,
    getBatchCandidateTicketIds,
    getCandidateEpoch,
    getPoolRemainder,
    getTicketPrice,
    GetCandidateTicketCount,
    GetTicketCountByTxHash
}