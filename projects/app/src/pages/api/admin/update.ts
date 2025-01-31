import { spawn } from 'child_process';
import { promisify } from 'util';

export default async function handler(req, res) {
  try {
    const command = "sudo su soubhik -c 'bash $HOME/update > $HOME/update.log &'";
    const childProcess = spawn(command, {
      shell: true,
      detached: true,
      stdio: 'ignore'
    });
    childProcess.unref();

    res.status(200).json({ status: true, message: 'Update Started' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error :(' });
  }
}
