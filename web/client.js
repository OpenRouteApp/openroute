import { NumberRequest } from './generated/number_pb.js';
import { NumberServiceClient } from './generated/number_grpc_web_pb.js';

const client = new NumberServiceClient('http://localhost:8080');

const button = document.getElementById('sendBtn');
const input = document.getElementById('numberInput');
const result = document.getElementById('response');

button.addEventListener('click', () => {
  const req = new NumberRequest();
  req.setValue(parseInt(input.value));

  client.sendNumber(req, {}, (err, res) => {
    if (err) {
      result.textContent = 'Error: ' + err.message;
    } else {
      result.textContent = res.getMessage();
    }
  });
});
