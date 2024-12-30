import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const storageAdapter = createEntityAdapter();

const initialState = storageAdapter.getInitialState({
  url: "",
  status: "idle",
  error: null,
});

// generador de un identificador random para integrarlo en el nombre de la imagen y el nombre siempre sea diferente
const randomID = (longitud) => {
  var caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var cadenaAleatoria = "";

  for (var i = 0; i < longitud; i++) {
    var posicion = Math.floor(Math.random() * caracteres.length);
    cadenaAleatoria += caracteres.charAt(posicion);
  }

  return cadenaAleatoria;
};

// Thunk functions for add a document image to a collection
export const setFile = createAsyncThunk(
  "firestore/setFile",
  async ({ file, name, folder }) => {
    try {
      // Create a root reference
      const storage = getStorage();
      const random = randomID(8);

      // Upload file and metadata to the object 'images/mountains.jpg'
      const storageRef = ref(storage, folder + "/" + name + "_" + random);
      const uploadTask = uploadBytesResumable(storageRef, file, file.type);

      let promise = await new Promise((resolve, reject) => {
        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (error) => {
            resolve(false);
          },
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });

      return promise;
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

// Thunk functions for add a document to a collection
export const deleteFile = createAsyncThunk(
  "firestore/deleteFile",
  async ({ urlFile }) => {
    try {
      const storage = getStorage();

      // Create a reference to the file to delete
      const desertRef = ref(storage, urlFile);

      let promise = await new Promise((resolve) => {
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            // File deleted successfully
            resolve(true);
          })
          .catch((error) => {
            // Uh-oh, an error occurred!
            resolve(false);
          });
      });

      return promise;
    } catch (error) {
      return { error, status: "failed" };
    }
  }
);

const storageSlice = createSlice({
  name: "storage",
  initialState,
  reducers: {
    // reducer
  },
  extraReducers: (builder) => {
    builder
      // control de estado de la promesa para setFile
      .addCase(setFile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(setFile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.url = action.payload;
      })
      .addCase(setFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // control de estado de la promesa para deleteFile
      .addCase(deleteFile.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default storageSlice.reducer;
