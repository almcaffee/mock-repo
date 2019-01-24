import { SensitiveInfoPipe } from './sensitive-info.pipe';

describe('SensitiveInfoPipe', () => {
  it('create an instance', () => {
    const pipe = new SensitiveInfoPipe();
    expect(pipe).toBeTruthy();
  });

  it('mask date', () => {
    const pipe = new SensitiveInfoPipe();
    let maskedDate = pipe.transform('10011980', 'date');
    expect(maskedDate).toEqual('XX/XX/XXXX');
  });

  it('mask all digits', () => {
    const pipe = new SensitiveInfoPipe();
    let maskedAll = pipe.transform('123456789', 'all');
    expect(maskedAll).toEqual('*********');
  });

  it('display all digits mask all except last four', () => {
    const pipe = new SensitiveInfoPipe();
    let maskedLong = pipe.transform('123456789', 'long');
    expect(maskedLong).toEqual('*****6789');
  });

  it('display last 4 with * at beginning', () => {
    const pipe = new SensitiveInfoPipe();
    let maskedDefault = pipe.transform('123456789');
    expect(maskedDefault).toEqual('*6789');
  });
});
