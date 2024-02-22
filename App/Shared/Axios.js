import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://192.168.29.118:1337/api",
  headers: {
    "X-API-KEY": "92ffae10137124b7b99f0933a2183d0acd6a36820de3047cfe500f24c7a34722b9dd0d30bcde75ce8cc5b8bbd78ca1c45cdcbc84c68f5390fd7f0d7e1b3e904e494528e68ac226bce2671d6f1fb10b0b591302fec1afd16d104da8dcc392d9a5be617a8aa572e59231d05a11cf90c538616fa731e6565c20df6e576f322b509b"
  }
});
