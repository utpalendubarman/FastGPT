import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

export default async function handler(req, res) {
  try {
    // run coammnd
    const command = 'bash $HOME/update > $HOME/update.log & ';
    await execAsync(command);
    res.status(200).json({ status: true, message: 'Updating...' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'Internal Server Error :(' });
  }
}
