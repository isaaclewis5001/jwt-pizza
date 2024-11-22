import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Imported_HAR: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 20, duration: '1m' },
        { target: 20, duration: '3m30s' },
        { target: 0, duration: '1m' },
      ],
      gracefulRampDown: '30s',
      exec: 'imported_HAR',
    },
  },
}

export function imported_HAR() {
  let response

  const vars = {}

  group('page_1 - https://www.pizzasco.lol/login', function() {
    response = http.options('https://pizza-service.pizzasco.lol/api/auth', null, {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Access-Control-Request-Method': 'PUT',
        'Access-Control-Request-Headers': 'content-type',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=4',
      },
    })

    response = http.put('https://pizza-service.pizzasco.lol/api/auth', '{"email":"k6man@gmail.com","password":"k6man"}', {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=1',
      },
    })

    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log("login failure")
      fail()
    }

    vars['auth'] = response.json().token

    sleep(1)

    response = http.options('https://pizza-service.pizzasco.lol/api/order/menu', null, {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization,content-type',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=4',
        TE: 'trailers',
      },
    })

    response = http.get('https://pizza-service.pizzasco.lol/api/order/menu', {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + vars['auth'],
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=1',
        TE: 'trailers',
      },
    })

    response = http.options('https://pizza-service.pizzasco.lol/api/franchise', null, {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'authorization,content-type',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=4',
        TE: 'trailers',
      },
    })

    response = http.get('https://pizza-service.pizzasco.lol/api/franchise', {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + vars['auth'],
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=4',
        TE: 'trailers',
      },
    })
    sleep(1)

    response = http.options('https://pizza-service.pizzasco.lol/api/order', null, {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=4',
        TE: 'trailers',
      },
    })

    response = http.post('https://pizza-service.pizzasco.lol/api/order', '{"items":[{"menuId":2,"description":"Pepperoni","price":0.0042}],"storeId":"1","franchiseId":1}', {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + vars['auth'],
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=1',
        TE: 'trailers',
      },
    })

    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log("order failure")
      fail()
    }

    vars['jwt'] = response.json().jwt

    sleep(1)

    response = http.options('https://pizza-factory.cs329.click/api/order/verify', null, {
      headers: {
        Host: 'pizza-factory.cs329.click',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'authorization,content-type',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        Priority: 'u=4',
      }
    })

    response = http.post('https://pizza-factory.cs329.click/api/order/verify', JSON.stringify({ jwt: vars['jwt'] }), {
      headers: {
        Host: 'pizza-factory.cs329.click',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + vars['auth'],
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
        Priority: 'u=1',
      },
    })
    sleep(1)

    response = http.options('https://pizza-service.pizzasco.lol/api/auth', null, {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Access-Control-Request-Method': 'DELETE',
        'Access-Control-Request-Headers': 'authorization,content-type',
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=4',
        TE: 'trailers',
      },
    })

    response = http.del('https://pizza-service.pizzasco.lol/api/auth', null, {
      headers: {
        Host: 'pizza-service.pizzasco.lol',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          'Bearer ' + vars['auth'],
        Origin: 'https://www.pizzasco.lol',
        DNT: '1',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        Priority: 'u=1',
        TE: 'trailers',
      },
    })
  })
}
