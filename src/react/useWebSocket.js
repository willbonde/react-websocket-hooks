import { useState, useEffect } from 'react'

/**
 *
 * @param {string}   url                URL to connect to
 * @param {object}   options            Options for hook
 *        {function} options.filter     A filter method to determine if a message should be sent to the user
 *                                      of the hook
 *        {string[]} options.protocols  An array of protocols to use in  the connection
 *
 *
 * @returns {unknown}
 */
export default function useWebSocket(url, options) {
  let socket = null;

  //State
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState(null);

  /**
   * @returns {boolean} True when the WebSocket is connected.
   */
  function isConnected() {
    if (socket !== null) {
      return socket.readyState === WebSocket.OPEN;
    } else {
      return false;
    }
  }

  function connect() {
    if (isConnected() === false) {
      //TODO: Add support for protocols
      socket = new WebSocket(url);
    } else {
      throw new Error('WebSocket is already connected');
    }
  }

  function disconnect(code, reason) {
    if (!isConnected())  {
      throw new Error('WebSocket is not connected');
    }

    socket.close(code, reason);
  }

  //Events
  useEffect(() => {
    socket.onopen = () => {
      setConnected(true);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onmessage = (event) => {
      if (options.filter == null || options.filter(event.data)) {
        setMessage(event.data);
      }
    };
  });

  return [message, isConnected, connect, disconnect];
}
