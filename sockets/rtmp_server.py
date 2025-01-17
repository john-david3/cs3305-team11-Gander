import socket, threading, os, time, traceback, struct

class RTMPClientState:
    """Enumeration of RTMP client states."""
    EPOCH = 0

class RTMPServer:
    def __init__(self, host='192.168.1.15', port=1935):
        self.host = host
        self.port = port
        self.server_socket = None
        self.is_running = True
        self.clients = []

    def start(self):
        """Starts a basic server to display incoming packets."""
        # Create a TCP socket
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.bind((self.host, self.port))
        self.server_socket.listen(1)
        print(f"RTMP Server started on {self.host}:{self.port}. Waiting for connections...")

        while self.is_running:
            try:
                client_socket, address = self.server_socket.accept()
                print(f"Connection accepted from {address}")
                client_thread = threading.Thread(target=self.handle_client, args=(client_socket,))
                client_thread.daemon = True
                client_thread.start()
            except Exception as e:
                print(f"Error accepting connection: {e}")
                print(traceback.format_exc())
                break

    def handle_client(self, client_socket):
        """
        Handle an incoming RTMP client connection.

        :param client_socket: The client socket object.
        """
        try:
            # Perform RTMP handshake
            if not self._attempt_handshake(client_socket):
                print("Handshake failed.")
                client_socket.close()
                return

            print("Handshake successful. Ready to handle RTMP stream.")
        except Exception as e:
            print(f"Error handling client: {e}")
            print(traceback.format_exc())
        finally:
            client_socket.close()

    def _attempt_handshake(self, client_socket):
        """Performs the RTMP handshake with the client."""
        # Receive C0 and C1 packets and validate
        c0 = int.from_bytes(client_socket.recv(1))
        if c0 != 3:
            print("Invalid RTMP version.")
            return False
        
        c1 = client_socket.recv(1536)
        time_epoch = int.from_bytes(c1[:4])
        zeros = int.from_bytes(c1[4:8])
        random_bytes = c1[8:]

        if zeros != 0:
            print("Invalid C1 packet.")
            return False

        # Send S0
        s0 = bytes([3])
        client_socket.send(s0)

        # Send S1
        s1 = bytearray(c1)
        server_random = os.urandom(1528)
        current_timestamp = struct.pack(">I" ,int(time.time()))
        s1[:4] = current_timestamp
        s1[8:] = server_random
        client_socket.send(bytes(s1))

        # Receive C2
        c2 = client_socket.recv(1536)
        if c2[8:] != server_random:
            print("Invalid C2 packet.")
            return False
    



        # debug
        print(f"Version: {c0}")
        print(f"Epoch time: {time_epoch}")
        print(f"Zeros: {zeros}")
        #print(f"Random bytes: {random_bytes}")


    def stop(self):
        """
        Stop the RTMP server.
        """
        self.is_running = False
        if self.server_socket:
            self.server_socket.close()
        print("RTMP Server stopped.")


def start_rtmp_server(host='127.0.0.1', port=1935):
    """Starts a basic RTMP server to display incoming packets."""
    try:
        # Create a TCP socket
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((host, port))
        server_socket.listen(1)
        print(f"RTMP server started on {host}:{port}. Waiting for connections...")

        # Accept a connection
        conn, addr = server_socket.accept()
        print(f"Connection established with {addr}")

        while True:
            # Receive RTMP C0 and C1 packets
            data = conn.recv(1)
            if not data:
                print("Connection closed by client.")
                break
            
            # Display the received RTMP packets
            print(f"Version: {int.from_bytes(data)}")
            break

    except KeyboardInterrupt:
        print("\nServer shutting down.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        server_socket.close()
        print("Server socket closed.")

if __name__ == "__main__":
    c = RTMPServer()
    try:
        c.start()
    except KeyboardInterrupt:
        print("Shutting down RTMP Server...")
        c.stop()

