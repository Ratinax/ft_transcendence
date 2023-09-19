import * as dotenv from 'dotenv';

dotenv.config();

export const ConfigIp = {
  IP: process.env.IP_ADDRESS || 'localhost',
};