function extractObjectDetailsFromEvent(event) {
  return event.Records.reduce((filenames, eventRecord) => {
    const body = JSON.parse(eventRecord.body);

    filenames = [...filenames, ...body.Records.map(bodyRecord => {
      const bucket = bodyRecord.s3.bucket.name;
      const key = bodyRecord.s3.object.key;
      return { bucket, key };
    })];

    return filenames;
  }, []);
}

module.exports = extractObjectDetailsFromEvent;