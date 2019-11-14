# micro-jaymock

> Tiny API mocking microservice, using jaymock.

## Usage

- Send a `POST` request to [`https://jaymock.now.sh/`](https://jaymock.now.sh) with your JSON template (see [`jaymock.populate`'s `template` parameter](https://github.com/unmock/jaymock#populatetemplate)) as your request's `body`.

### Examples

#### Using curl:

```
~ ❯❯❯ curl -X POST \
        -d '{ "firstName": "name.firstName", "lastName": "name.lastName" }' \
        https://jaymock.now.sh
{"firstName":"Isaac","lastName":"Schultz"}
```

#### Using [httpie](https://github.com/jakubroztocil/httpie):
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

## License

MIT © [Meeshkan](http://meeshkan.com/)