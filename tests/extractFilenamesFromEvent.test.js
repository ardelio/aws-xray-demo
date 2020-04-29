const extractObjectDetailsFromEvent = require('../src/extractObjectDetailsFromEvent');

describe('extractObjectDetailsFromEvent', () => {
  describe('with one event record', () => {
    describe('with one body record', () => {
      it('extracts the filename', () => {
        const event = require('./fixtures/event-with-single-event-record.json');
        const expectedFilenames = [{
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-1.json',
        }];

        const filenames = extractObjectDetailsFromEvent(event);

        expect(filenames).toEqual(expectedFilenames);
      });
    });
    describe('with multiple body records', () => {
      it('extracts the filenames', () => {
        const event = require('./fixtures/event-with-single-event-record-multiple-body-records.json');
        const expectedFilenames = [{
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-1.json',
        }, {
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-2.json',
        }];

        const filenames = extractObjectDetailsFromEvent(event);

        expect(filenames).toEqual(expectedFilenames);
      });
    });
  });

  describe('with multiple event records', () => {
    describe('with one body record', () => {
      it('extracts the filenames', () => {
        const event = require('./fixtures/event-with-multiple-event-records.json');
        const expectedFilenames = [{
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-1.json',
        }, {
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-2.json',
        }];

        const filenames = extractObjectDetailsFromEvent(event);

        expect(filenames).toEqual(expectedFilenames);
      });
    });

    describe('with multiple body records', () => {
      it('extracts the filenames', () => {
        const event = require('./fixtures/event-with-multiple-event-records-multiple-body-records.json');
        const expectedFilenames = [{
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-1.json',
        }, {
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-2.json',
        }, {
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-3.json',
        }, {
          bucket: 'aws-xray-demo-bucket-1xm9j1cmiyc82',
          key: 'file-4.json',
        }];

        const filenames = extractObjectDetailsFromEvent(event);

        expect(filenames).toEqual(expectedFilenames);
      });
    });
  });
});