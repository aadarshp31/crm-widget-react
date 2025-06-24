
class UTILS {
    static async testZOHOCRMMethods() {
        try {
    		ZDK.Client.showLoader({template: "vertical-bar", message: "Running ZOHO.CRM methods..."});
			const result = {};
            result.getCurrentUser = await ZOHO.CRM.CONFIG.getCurrentUser();
            result.getOrgInfo = await ZOHO.CRM.CONFIG.getOrgInfo();
            result.getUserPreference = await ZOHO.CRM.CONFIG.getUserPreference();

            // META
            result.getModules = await ZOHO.CRM.META.getModules();
            
			return result;
        } catch (e) {
            console.error("ZOHO.CRM SDK error", e);
        } finally {
			// Cleanup if needed
			ZDK.Client.hideLoader();
		}
    }

    static async testZRCMethods() {
        try {
            const result = {};
            // CRM API calls
            result.crmApiCalls = await crmApiCalls();

            // External and Connection API calls
            result.extAndConnCalls = await extAndConnCalls();

            // Create Instance Example
            result.createInstanceExample = await createInstanceExample();

            // Image upload test
            //   const WEBHOOK_URL = "https://webhook.site/#!/view/6ef18f7e-a10c-4875-8960-856337a4801b";
            // await uploadTest(WEBHOOK_URL);
            return result;
        } catch (e) {
            console.error("zrc error", e);
        }

        // crm api calls
        async function crmApiCalls() {
            try {
                const usersRes = await zrc.get("/crm/v7/users");
                const rolesRes = await zrc.get("/crm/v7/settings/roles");

                const profilesRes = await zrc.request({
                    method: "get",
                    path: "/crm/v7/settings/profiles",
                });

                const result = { usersRes, rolesRes, profilesRes };
                console.log('CRM API CALLS RESULT => ', result);
                return result;
            } catch (err) {
                console.error(err);
            }
        }

        // ZRC External and Connection API calls
        async function extAndConnCalls() {
            try {
                const formData = new FormData();
                formData.append("id", 101);
                formData.append("title", "some title for the blog");
                formData.append("body", "body for the blog...");

                const createPostWithFormData = await zrc.post("/posts", formData, {
                    baseUrl: "https://jsonplaceholder.typicode.com",
                    responseType: "text",
                });

                const getAllPosts = await zrc.get("https://jsonplaceholder.typicode.com/posts");

                const getAllPostsViaConnections = await zrc.request({
                    method: "get",
                    path: "/posts",
                    connection: "zohocrm",
                    baseUrl: "https://jsonplaceholder.typicode.com",
                });

                const createPostWithJsonData = await zrc.request({
                    method: "post",
                    path: "https://jsonplaceholder.typicode.com/posts",
                    responseType: "text",
                    body: {
                        title: "some title",
                        body: "some body for the post",
                    },
                });

                const jsonPlaceHolderUsersRes = await zrc.get("https://jsonplaceholder.typicode.com/users/");

                const result = { createPostWithFormData, getAllPosts, getAllPostsViaConnections, createPostWithJsonData, jsonPlaceHolderUsersRes };
                console.log('EXTERNAL AND CONNECTION CALLS RESULT => ', result);
                return result;
            } catch (err) {
                console.error(err);
            }
        }

        // zrc.createInstance examples
        async function createInstanceExample() {
            try {
                const jsonPlaceHolder = zrc.createInstance({
                    baseUrl: "https://jsonplaceholder.typicode.com",
                    responseType: "text",
                });

                const resAllPosts = await jsonPlaceHolder.get("/posts");
                const resOnePost = await jsonPlaceHolder.get("/posts/1");
                const resAllPhotos = await jsonPlaceHolder.get("/photos", {
                    responseType: "json",
                });
                const resOnePhoto = await jsonPlaceHolder.get("/photos/1");

                const result = { resAllPosts, resOnePost, resAllPhotos, resOnePhoto };
                console.log('CREATE INSTANCE EXAMPLE RESULT => ', result);
                return result;
            } catch (error) {
                console.error({ error });
            }
        }

        // image download and upload flow test
        async function uploadTest(WEBHOOK_URL = WEBHOOK_URL) {
            try {
                const imageDownloadResponse = await zrc.get("https://picsum.photos/150", {
                    responseType: "blob",
                });
                console.info({ imageDownloadResponse });

                // Example image
                imageBlob = imageDownloadResponse.data;

                const formData = new FormData();
                formData.append("id", 101);
                formData.append("title", "some title for the blog");
                formData.append("body", "body for the blog...");
                formData.append("file", imageBlob, imageBlob.name || "image.jpeg");

                const impageUploadedRes = await zrc.post(`${WEBHOOK_URL}/widget/upload`, formData);

                const result = { imageDownloadResponse, impageUploadedRes };
                console.log('IMAGE UPLOAD TEST RESULT => ', result);
                return result;
            } catch (error) {
                console.error({ error });
            }
        }
    }

    static async testZDKMethods() {
        try {
            const result = {};
            await ZDK.Client.showAlert("Sanity: ZDK showAlert works!");
			result.showAlert = 'Sanity: ZDK showAlert works!';
            result.showConfirmation = await ZDK.Client.showConfirmation("Sanity: ZDK showConfirmation?", "Yes", "No");
            await ZDK.Client.showMessage("Sanity: ZDK showMessage works!");
			result.showMessage = 'Sanity: ZDK showMessage works!';

            return result;
            // $Client
            // await $Client.close({ status: "Sanity test complete" });
        } catch (e) {
            console.error("ZDK/$Client error", e);
        }
    }
}

export default UTILS;
