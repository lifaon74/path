import { testPath } from './tests/test';

window.onload = () => {
  testPath()
    .catch((error) => console.error(error));
};






