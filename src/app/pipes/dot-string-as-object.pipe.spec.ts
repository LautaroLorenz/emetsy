import { DotStringAsObjectPipe } from './dot-string-as-object.pipe';

describe('DotStringAsObjectPipe', () => {
  it('create an instance', () => {
    const pipe = new DotStringAsObjectPipe();
    expect(pipe).toBeTruthy();
  });
});
