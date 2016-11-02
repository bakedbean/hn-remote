'use strict';

export default job => {
  let distance = 0;

  if (!job || !job.text) return false;
  let remote = job.text.toLowerCase().indexOf('remote');
  let onsite = job.text.toLowerCase().indexOf('onsite');

  if (remote > onsite) {
    distance = remote - onsite;
  } else if (remote > 0 && onsite > remote) {
    distance = onsite - remote;
  }

  if (distance < 25 && distance > 0) return true;
  return remote >= 0 && onsite < 0;
}
