import Document from "./models/Document.js";

const socketHandler = (io) => {
       io.on("connection", (socket) => {

        console.log(`Client connected: ${socket.id}`);


        // JOIN DOCUMENT
        socket.on("join-document", async (documentId) => {

            try {

                // JOIN ROOM
                socket.join(documentId);

                console.log(`Socket ${socket.id} joined room ${documentId}`);


                // FIND DOCUMENT
                const document = await Document.findById(documentId);

                // CHECK DOCUMENT EXISTS
                if (!document) {

                    return socket.emit("document-error", {
                        message: "Document not found"
                    });

                }

                // SEND DOCUMENT CONTENT TO CURRENT USER
                socket.emit("load-document", document.content);

                // RECEIVE CHANGES FROM ONE USER
                socket.on("send-changes", (delta) => {

                    // SEND CHANGES TO EVERYONE ELSE IN ROOM
                    socket.to(documentId).emit("receive-changes", delta);

                });

            } catch (error) {
                console.log(error.message);
            }

        });

         // RECEIVE CHANGES
        socket.on("send-changes", (delta) => {

            // CHECK CURRENT DOCUMENT EXISTS
            if (!socket.currentDocument) return;

            // SEND TO EVERYONE ELSE IN ROOM
            socket.to(socket.currentDocument).emit(
                "receive-changes",
                delta
            );

        });

        // SAVE DOCUMENT
        socket.on("save-document", async (content) => {

            try {

                // CHECK CURRENT DOCUMENT EXISTS
                if (!socket.currentDocument) return;

                // UPDATE DOCUMENT CONTENT
                await Document.findByIdAndUpdate(
                    socket.currentDocument,
                    {
                        content
                    }
                );

                console.log(`Document ${socket.currentDocument} saved`);

            } catch (error) {

                console.log(error.message);

            }

        });

        // OPTIONAL CURSOR TRACKING
        socket.on("cursor-move", (cursorData) => {

            if (!socket.currentDocument) return;

            socket.to(socket.currentDocument).emit(
                "receive-cursor",
                cursorData
            );

        });
        
        socket.on('disconnect', () => {
            console.log(`client disconnected: ${socket.id}`);
        });
    });
}

export default socketHandler;