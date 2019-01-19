# Payments API

## Deployment

Build a Docker image:

```bash
./build.sh
```

and run it:

```bash
 docker run -it --rm -r 'MONGO_URI=<MONGO_URI>' -p 3000:3000 payments_api:3a1903d
 ```