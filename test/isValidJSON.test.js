global.Bare = {};

import path from 'bare-path'; // Import bare-path
import process from 'bare-process'; // Import bare-process

describe('Mocking bare-path and bare-process', function() {
  let pathStub, processStub;

  beforeEach(function() {
    // Stubbing `bare-path` module (mocking the default export's join method)
    pathStub = sinon.stub(path, 'default').value(() => {
      return {
        join: (...args) => args.join('/'), // Mocked join implementation
      };
    });

    // Stubbing `bare-process` module (mocking a process method, e.g., exec)
    processStub = sinon.stub(process, 'exec').resolves('mocked exec result'); // Mocked exec method
  });

  afterEach(function() {
    // Restoring original behavior after each test
    pathStub.restore();
    processStub.restore();
  });

  it('should mock bare-path join correctly', function() {
    // Call the mocked `bare-path` join function
    const result = barePath.default().join('path', 'to', 'file');
    expect(result).to.equal('path/to/file'); // Check mocked result
  });

  it('should mock bare-process exec correctly', async function() {
    // Call the mocked `bare-process` exec function
    const result = await bareProcess.exec('some command');
    expect(result).to.equal('mocked exec result'); // Check mocked result
  });
});


// test('isValidJSON should validate JSON strings correctly', (t) => {
//     t.ok(isValidJSON('{"key": "value"}'), 'Valid JSON string returns true');
//     t.not(isValidJSON('{key: value}'), 'Invalid JSON string returns false');
//     t.not(isValidJSON('random string'), 'Non-JSON string returns false');
// });
