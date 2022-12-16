"use strict";

const expect = require('chai').expect;
const axios = require('axios');
require('dotenv').config();

const random_note_name = Math.random().toString(36).slice(2, 7);
const BASE_URL = process.env.HttpApiUrl;

const test_data = {
  note_name: random_note_name,
  note_description: 'This note was created by Integration testing.'
};

axios.interceptors.response.use(response => {
  return response;
}, error => {
  return error.response;
});
axios.default.timeout = 29000;

describe("integration test", () => {
  before((done) => {
    done();
  });

  it("create note", async () => {
    const response = await axios.post(BASE_URL, test_data);
    expect(response).to.have.property("status").equal(201);
    expect(response).to.have.property("data").equal(`Note "${random_note_name}" inserted in table.`);
    console.log(`Note ${random_note_name} created successfully.`);
  });

  it("recreate same note", async () => {
    const response = await axios.post(BASE_URL, test_data);
    expect(response).to.have.property("status").equal(409);
    expect(response).to.have.property("data").equal(`Note "${random_note_name}" already exists in table.`);
    console.log('Error treated successfully.');
  });

  it("get notes", async () => {
    const response = await axios.get(BASE_URL);
    expect(response).to.have.property("status").equal(200);
    expect(JSON.stringify(response.data.notes)).equal(JSON.stringify([test_data]));
    console.log('Notes get successfully');
  });

  it("update note", async () => {
    test_data.note_description = 'Updated description by integration testing.';
    const response = await axios.put(BASE_URL, test_data);
    expect(response).to.have.property("status").equal(201);
    expect(response).to.have.property("data").equal(`Note "${random_note_name}" updated in table.`);
    console.log(`Note ${random_note_name} updated successfully`);
  });

  it("update not existing note", async () => {
    test_data.note_name = 'not_existed_note';
    const response = await axios.put(BASE_URL, test_data);
    expect(response).to.have.property("status").equal(404);
    expect(response).to.have.property("data").equal(`Note "not_existed_note" do not exists in table.`);
    console.log('Not existing note update treated successfully');
  });

  it("delete note", async () => {
    const response = await axios.delete(BASE_URL + `/${random_note_name}`);
    expect(response).to.have.property("status").equal(200);
    expect(response).to.have.property("data").equal(`Note "${random_note_name}" deleted.`);
    console.log(`Note ${random_note_name} deleted successfully`);
  });

  it("delete not existing note", async () => {
    const response = await axios.delete(BASE_URL + "/not_exists_note");
    expect(response).to.have.property("status").equal(404);
    expect(response).to.have.property("data").equal('Note "not_exists_note" do not exist.');
    console.log(`Note ${random_note_name} deleted successfully`);
  });
});
