const request = require('request-promise-native')
const randomName = require("chinese-random-name");
const crypto = require('crypto');

async function main() {
  for(let i = 1000001; i <= 1100000; i++) {
    const data = generateDate(i)

    try {
      const res = await request('http://127.0.0.1:8000/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data)
      })
      console.log(i + ':' + res)
    } catch (error) {
      console.log(i + ':' + error.message)
    }
    
  }
}

function generateDate(i) {
  const name = randomName.generate()
  return {
    nickname: name,
    phone: String(17800000000 + i),
    password: randomString(12),
    remark: name,
    openid: randomString(24),
    type: (i % 2) + 1,
    unionid: randomString(32),
    country: randomString(3).toUpperCase(),
    province: randomString(3).toUpperCase(),
    city: randomString(3).toUpperCase(),
    gender: 1 % 2,
    avatarUrl: 'http://localhost:8000/avatar/' + randomString(8),
    appid: 'wx' + randomString(18),
    msgCode: 'xxx',
    msgStr: 'xxx'
  }
}

function randomString(len) {
  return crypto.randomBytes(Math.ceil(len / 2)).toString('hex').slice(0, len)
}

main()
