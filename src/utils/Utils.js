const WEBHOOK_URL = 'https://webhook.site/2df0a6d1-a494-449d-94b6-9176f1a5caae/widget/upload'

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

            result.testMissingZrcCases = await testMissingZrcCases();

            // Image upload test
            result.uploadTest = await uploadTest(WEBHOOK_URL);

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
                    baseUrl: "https://jsonplaceholder.typicode.com"
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
                const imageBlob = imageDownloadResponse.data;

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

        // test missing cases
        async function testMissingZrcCases() {
            const result = {};

            // wrong connection name
            try {
                result.wrongConnectionNameResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", { connection: "zohocrmmmmm" });
            } catch (error) {
                result.wrongConnectionNameResponse = error;
            }

            // response type stream not supported
            try {
                result.streamRespTypeNotSupported = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", { responseType: "stream" });
            } catch (error) {
                result.streamRespTypeNotSupported = error;
            }

            // 404 error response
            try {
                result.result400Response = await zrc.get("https://jsonplaceholder.typicode.com/asdasdasd");
            } catch (error) {
                result.result400Response = error;
            }

            // connection 404 error response
            try {
                result.result400ConnectionResponse = await zrc.get("https://jsonplaceholder.typicode.com/asdasdasd", { connection: "zohocrm" });
            } catch (error) {
                result.result400ConnectionResponse = error;
            }

            // all responseTypes responses
            try {
                result.arrayBufferConnectionResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", {
                    connection: "zohocrm",
                    responseType: "arraybuffer"
                });
                result.jsonConnectionResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", {
                    connection: "zohocrm",
                    responseType: "json"
                });
                result.textConnectionResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", {
                    connection: "zohocrm",
                    responseType: "text"
                });
                result.arrayBufferResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", { responseType: "arraybuffer" });
                result.nonJsonResponseWithJsonRespType = await zrc.get("https://jsonplaceholder.typicode.com", { responseType: "json" });
                result.jsonResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", { responseType: "json" });
                result.textResponse = await zrc.get("https://jsonplaceholder.typicode.com/posts/2", { responseType: "text" });
            } catch (error) {
                result.error = error;
            }

            console.info("testMissingZrcCases => ", result);
            return result;
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
            result.getInput = await ZDK.Client.getInput([{ type: 'textarea', label: 'Enter batch name', default_value:'sample' }], 'Employees', 'OK', 'Cancel');
            result.openPopup = await ZDK.Client.openPopup({ api_name: 'custom_button_sample_widget', type: 'widget', header: 'Sample Widget', animation_type: 4, height: '450px', width: '450px', left: '10px' }, { data: 'sample data to be passed to "PageLoad" event of widget' });

            return result;
            // $Client
            // await $Client.close({ status: "Sanity test complete" });
        } catch (e) {
            console.error("ZDK/$Client error", e);
        }
    }
}

export default UTILS;
