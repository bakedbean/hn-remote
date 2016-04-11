import {expect} from 'chai';

import search from '../src/search';

describe('search', () => {

  it('should return false if no job text', () => {
    const job = {
      id: 11405685,
      text: undefined,
      time: 1459525664
    };
    expect(search(job)).to.equal(false);
  });

  // several posts say "ONSITE" in title, but then have the word "remote" somewhere in the description
  // in most cases, the word "remote" is not in relation to telecommuting, or in reference to limited remote tolerance
  // which we are not interested in at this time
  it('should reject job if the word "onsite" is present and not within 25 characters of "remote"', () => {
    const job = {
      id: 11405685,
      text: "2U | NYC | ONSITE | Various Positions sample text, sample text, sample text, sample text, sample text, some remote ok",
      time: 1459525664
    };
    expect(search(job)).to.equal(false);
  });

  it('should accept the job if the words "remote" and "onsite" are within 25 characters of each other', () => {
    const job = {
      id: 11405685,
      text: "2U | NYC | ONSITE OR REMOTE ok | Various Positions",
      time: 1459525664
    };
    expect(search(job)).to.equal(true);
  });

  it('should accept the job if "remote" is present', () => {
    const job = {
      id: 11405685,
      text: "2U | NYC | REMOTE ok | Various Positions",
      time: 1459525664
    };
    expect(search(job)).to.equal(true);
  });
});
