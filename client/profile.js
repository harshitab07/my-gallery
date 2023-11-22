const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

const getPfp = () => {
  // Get the profile image URL from localStorage
  const profileImageUrl = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth")).profile
    : "";

  // Set the src attribute of the img tag with the profile image URL
  const profileImage = document.getElementById("pfp");
  profileImage.src = profileImageUrl;
};

const getUserInfo = async (accessToken) => {
  const userInfoEndpoint = "https://www.googleapis.com/oauth2/v2/userinfo";

  try {
    const response = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const userData = await response.json();
      try {
        const loginUrl = "http://localhost:8080/api/v1/auth/login";
        const response = await fetch(loginUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userData.email,
            name: userData.name,
            image: userData.picture,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          window.alert(errorData?.message);
        } else {
          const responseData = await response.json();
          localStorage.setItem("auth", JSON.stringify(responseData.data));
          getPfp();
        }
      } catch (error) {
        console.log("Login failed", { error });
        window.alert("Failed to login");
      }
    } else {
      console.error("Failed to fetch user info:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching user info:", error);
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const accessToken = getParameterByName("access_token");
  window.history.replaceState({}, document.title, window.location.pathname);
  if (accessToken) {
    getUserInfo(accessToken);
  } else {
    console.log("Access token not found in URL.");
  }
});

const signOut = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("images");
  window.location.href = "/client/";
};

getPfp();

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const fetchImages = async () => {
  try {
    localStorage.removeItem("images");
    const imagesUrl = "http://localhost:8080/api/v1/user/images";
    const response = await fetch(imagesUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: JSON.parse(localStorage.getItem("auth")).email,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      window.alert(errorData?.message);
    } else {
      const responseData = await response.json();
      if (responseData?.images?.length > 0) {
        localStorage.setItem("images", JSON.stringify(responseData.images));

        const imagesArray = JSON.parse(localStorage.getItem("images"));
        const imageGallery = document.getElementById("imageGallery");

        imagesArray.forEach((image) => {
          const imgElement = document.createElement("img");
          imgElement.classList.add('user-image', 'img-fluid');

          if (
            image.photo &&
            image.photo.data &&
            image.photo.data.data.length > 0
          ) {
            const base64Image = `data:${
              image.photo.contentType
            };base64,${arrayBufferToBase64(image.photo.data.data)}`;

            imgElement.src = base64Image;
          }
          imgElement.alt = "img";
          imageGallery.appendChild(imgElement);
        });
      }
    }
  } catch (error) {
    console.log("Images loading failed", { error });
  }

  const userImages = localStorage.getItem("images");
  if (!userImages) {
    document.getElementById("uploadSectionHeading").style.display = "block";
  }
};
fetchImages();

let result = document.querySelector(".result"),
  img_result = document.querySelector(".img-result"),
  img_w = document.querySelector(".img-w"),
  img_h = document.querySelector(".img-h"),
  options = document.querySelector(".options"),
  save = document.querySelector(".save"),
  cropped = document.querySelector(".cropped"),
  upload = document.querySelector("#file-input"),
  cropper = "";

const uploadImage = async (croppedCanvas) => {
  try {
    const productData = new FormData();
    productData.append("email", JSON.parse(localStorage.getItem("auth")).email);

    croppedCanvas.toBlob(async (blob) => {
      if (blob) {
        productData.append("photo", blob);

        const imagesUrl = "http://localhost:8080/api/v1/user/upload-image"; // Replace with your API endpoint
        const response = await fetch(imagesUrl, {
          method: "POST",
          body: productData, // Use the FormData directly as the body
        });

        if (!response.ok) {
          const errorData = await response.json();
          window.alert(errorData?.message);
        } else {
            result.innerHTML = "";
            save.classList.add("hide");
            window.location.reload();
        }
      } else {
        console.error("Failed to create Blob");
      }
    }, "image/png");
  } catch (error) {
    console.log("Images uploading failed", { error });
    window.alert("Failed to upload image");
  }
};

upload.addEventListener("change", (e) => {
  if (e.target.files.length) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target.result) {
        let img = document.createElement("img");
        img.id = "image";
        img.classList.add("img", "img-fluid");
        img.style.maxHeight = "300px";
        img.style.objectFit = "contain";
        img.src = e.target.result;
        result.innerHTML = "";
        result.appendChild(img);
        save.classList.remove("hide");
        cropper = new Cropper(img);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  }
});

save.addEventListener("click", (e) => {
  e.preventDefault();
  let croppedCanvas = cropper.getCroppedCanvas({
    width: img_w.value, // Input value
  });
  uploadImage(croppedCanvas);
});
