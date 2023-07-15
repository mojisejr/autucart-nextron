import { SerialPort } from "serialport";
import setting from "./setting.json";

const commands = {
  state: [0x02, 0x00, 0x30, 0x03, 0x35],
  unlocks: [
    {
      channel: 0,
      channelNo: 1,
      unlock: [0x02, 0x00, 0x31, 0x03, 0x36],
      closedStateBit: [0x07],
      openedStateBit: [0x06],
      byteIndex: [3],
    },
    {
      channel: 1,
      channelNo: 2,
      unlock: [0x02, 0x01, 0x31, 0x03, 0x37],
      openedStateBit: [0x05],
      closedStateBit: [0x06],
      byteIndex: [3],
    },
    {
      channel: 2,
      channelNo: 3,
      unlock: [0x02, 0x02, 0x31, 0x03, 0x38],
      closedStateBit: [0x03],
      openedStateBit: [0x06],
      byteIndex: [3],
    },
    {
      channel: 3,
      channelNo: 4,
      unlock: [0x02, 0x03, 0x31, 0x03, 0x39],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 4,
      channelNo: 5,
      unlock: [0x02, 0x04, 0x31, 0x03, 0x3a],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 5,
      channelNo: 6,
      unlock: [0x02, 0x05, 0x31, 0x03, 0x3b],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 6,
      channelNo: 7,
      unlock: [0x02, 0x06, 0x31, 0x03, 0x3c],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 7,
      channelNo: 8,
      unlock: [0x02, 0x07, 0x31, 0x03, 0x3d],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 8,
      channelNo: 9,
      unlock: [0x02, 0x08, 0x31, 0x03, 0x3e],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 9,
      channelNo: 10,
      unlock: [0x02, 0x09, 0x31, 0x03, 0x3f],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 10,
      channelNo: 11,
      unlock: [0x02, 0x0a, 0x31, 0x03, 0x40],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 11,
      channelNo: 12,
      unlock: [0x02, 0x0b, 0x31, 0x03, 0x41],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 12,
      channelNo: 13,
      unlock: [0x02, 0x0c, 0x31, 0x03, 0x42],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 13,
      channelNo: 14,
      unlock: [0x02, 0x0d, 0x31, 0x03, 0x43],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 14,
      channelNo: 15,
      unlock: [0x02, 0x0e, 0x31, 0x03, 0x44],
      closedStateBit: 1,
      openedStateBit: 0,
    },
    {
      channel: 15,
      channelNo: 16,
      unlock: [0x02, 0x0f, 0x31, 0x03, 0x45],
      closedStateBit: 1,
      openedStateBit: 0,
    },
  ],
};

function initSerialPort() {
  let port = new SerialPort({
    path: setting.path,
    baudRate: setting.baudRate,
    dataBits: setting.dataBits as 8 | 5 | 6 | 7,
    stopBits: setting.stopBits as 1 | 1.5 | 2,
    parity: setting.parity as "none" | "even" | "odd" | "mark" | "space",
    autoOpen: setting.autoOpen,
  });
  return port;
}

function portCheckState(port: SerialPort) {
  const command = getReadStateCommand();
  port.write(command);
}

function getReadStateCommand() {
  const command = commands.state;
  return command;
}

function portUnlockSlot(port: SerialPort, id: number) {
  const command = getUnlockCommand(id);
  port.write(command);
}

function getUnlockCommand(id: number) {
  const command = commands.unlocks[id - 1].unlock;
  return command;
}

export {
  commands,
  initSerialPort,
  portCheckState,
  portUnlockSlot,
  getReadStateCommand,
  getUnlockCommand,
};
