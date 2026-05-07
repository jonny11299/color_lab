

let uploadStartTime = Date.now();

// returns metadata once loaded
export async function uploadImage(file) {
    if (!file) {
        console.error("Called uploadImage with a null file.");
        return;
    }
    if (!file.type.startsWith('image/')) {
        console.error("Called uploadImage with a non-image file.");
        return;
    }

    uploadStartTime = Date.now();
    console.log("Uploading ", file.name);

    // Convert it into a format for datamoshing (base64 string)
    const base64image = await toBase64(file);

    const metadata = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({
                width: img.width,
                height: img.height,
                name: file.name,
                type: file.type,
                size: file.size // in bytes
            })
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = base64image
    });

    console.log(`Upload for ${file.name} completed in ${Date.now() - uploadStartTime} ms`);
    return metadata;
}

export async function toBase64(imageFile) {
    console.log("Converting to base 64...");
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log("Converted to base 64.");
            resolve(e.target.result);
        }
        reader.onerror = () => reject(new Error('Failed to convert to Base 64'));
        reader.readAsDataURL(imageFile);
    });
}
