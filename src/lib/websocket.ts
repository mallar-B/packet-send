import * as Ably from "ably";
import {
  AblyProvider,
  ChannelProvider,
  useChannel,
  useConnectionStateListener,
} from "ably/react";

export const client = new Ably.Realtime({
  key: "cYeJDg.HNohJw:2mm-krh7ZTiTC6vcPc7Sc0NbkRw-iLvLefS9OG4Q2kw",
});
