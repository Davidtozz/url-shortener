import { exec } from "child_process";

export default async function teardown() {
    exec('docker container stop url-shortener-test-db');
}