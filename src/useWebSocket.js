import { useState, useEffect, useRef } from 'react'

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
  const socket = useRef(null);

  //State
  const [message, setMessage] = useState("lol default");
  const [connected, setConnected] = useState(false);

  /**
   * @returns {boolean} True when the WebSocket is connected.
   *//*
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
     // socket = new WebSocket(url);
    } else {
      throw new Error('WebSocket is already connected');
    }
  }

  function disconnect(code, reason) {
    if (!isConnected())  {
      throw new Error('WebSocket is not connected');
    }

    socket.close(code, reason);
  } */

  //Events
  useEffect( () => {
      socket.current = new WebSocket(url);

      socket.current.onclose = (event) => {
        setConnected(false);
      };

      socket.current.onopen = (event) => {
        setConnected(true);
      };

      return () => {
        socket.current.close();
      };
  }, []);


  useEffect(() => {
    if (socket.current) {
      socket.current.onmessage = (event) => {
        if (options.filter === undefined || options.filter(event.data)) {
          setMessage(event.data);
        }
      };
    }
  }, []);


  return [message];
}
