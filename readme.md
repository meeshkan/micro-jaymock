# micro-jaymock

> Tiny API mocking microservice for generating fake JSON data.

<img src="demo.gif" width="800">

## Usage

- Send a `POST` request to [`https://jaymock.now.sh/`](https://jaymock.now.sh) with your JSON template (see [`jaymock.populate`'s `template` parameter](https://github.com/unmock/jaymock#populatetemplate)) as your request's `body`.

### Examples

#### Using `curl`:

```
~ ❯❯❯ curl -X POST \
        -d '{ "firstName": "name.firstName", "lastName": "name.lastName" }' \
        https://jaymock.now.sh
{"firstName":"Isaac","lastName":"Schultz"}
```

#### Using [`httpie`](https://github.com/jakubroztocil/httpie):
```
~ ❯❯❯ http -b POST https://jaymock.now.sh \
        firstName=name.firstName lastName=name.lastName ssn=chance.ssn \
        _repeat:=3
[
    {
        "firstName": "Jalyn",
        "lastName": "Weimann",
        "ssn": "493-64-4894"
    },
    {
        "firstName": "Alvah",
        "lastName": "Ziemann",
        "ssn": "567-92-8024"
    },
    {
        "firstName": "Bennett",
        "lastName": "Russel",
        "ssn": "356-24-9256"
    }
]
```

#### Using [`request`](https://github.com/request/request) (Node.js):
```js
const request = require('request')
const template = {
	firstName: 'name.firstName',
	lastName: 'name.lastName',
	ipAddresses: 'internet.ip|2'
}
request.post({url: 'https://jaymock.now.sh', json: template}, (error, response, body) => {
    if (error) {
        /* Handle error */
        console.error(error)
    }
    console.log(body)
    /*
        {
            firstName: 'Kaley',
            lastName: 'Muller',
            ipAddresses: [ '118.171.253.32', '193.234.186.225' ]
        }
    */
})
```

#### Using [`got`](https://github.com/sindresorhus/got) (Node.js):
```js
const got = require('got');
const template = {
    name: 'fake({{name.lastName}}, {{name.firstName}} {{name.suffix}})',
    ssn: 'chance.ssn',
    knownAddresses: {
        street: 'address.streetAddress',
        city: 'address.city',
        zipCode: 'address.zipCode',
        _repeat: 2
    }
};
(async () => {
    const {body} = await got.post('https://jaymock.now.sh', {
        json: template,
        responseType: 'json'
    });
    console.log(body);
    /*
        {
            name: 'Goodwin, Libby II',
            ssn: '368-52-3834',
            knownAddresses: [
                {
                    street: '42483 Citlalli Viaduct',
                    city: 'West Joeybury',
                    zipCode: '43966-8850'
                },
                {
                    street: '36297 Estella Throughway',
                    city: 'South Claudie',
                    zipCode: '39189-1653'
                }
            ]
        }
    */
})();
```

## Development

First, clone the repository and install its dependencies:
```
~ ❯❯❯ git clone https://github.com/unmock/micro-jaymock.git
~ ❯❯❯ cd micro-jaymock/
~/micro-jaymock ❯❯❯ npm install
```

Subsequently, start the development server:
```
~/micro-jaymock ❯❯❯ npm run dev
```
You can then access the service by navigating to [`localhost:3000`](http://localhost:3000).

## Deployment

[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/unmock/micro-jaymock)

Alternatively, to deploy `micro-jaymock` manually:

First, [download `now`](https://zeit.co/download):
```
~ ❯❯❯ npm install -g now
```

Then, run `now` from *within* the `micro-jaymock` directory:
```
~/micro-jaymock ❯❯❯ now
```

## Related

- [jaymock](https://github.com/unmock/jaymock) - API for this module

## Contributing

Thanks for wanting to contribute! We will soon have a contributing page
detailing how to contribute. Meanwhile, feel free to star this repository, open issues,
and ask for more features and support.

Please note that this project is governed by the [Unmock Community Code of Conduct](https://github.com/unmock/code-of-conduct). By participating in this project, you agree to abide by its terms.

## Credits

- [`Faker.js`](https://github.com/Marak/Faker.js) is used as [`jaymock`](https://github.com/unmock/jaymock)'s core fake data generator.
- [`chance`](https://github.com/chancejs/chancejs) is imported as a fake data generator dependency (using [`jaymock.extend`](https://github.com/unmock/jaymock#extendname-body)).
- [`micro`](https://github.com/zeit/micro) is used to serve this HTTP microservice.

## License

MIT © [Meeshkan](http://meeshkan.com/)