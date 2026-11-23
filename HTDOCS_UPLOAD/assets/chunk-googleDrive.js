import { i as signInWithPopup, r as onAuthStateChanged, t as GoogleAuthProvider } from "./chunk-vendor-firebase.js";
import { rt as auth } from "./app.js";
//#region src/utils/googleDrive.ts
/**
* Google Drive API Client & Backup Manager
* Uses OAuth 2.0 with scope: https://www.googleapis.com/auth/drive.file
*/
var DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
var SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
var provider = new GoogleAuthProvider();
provider.addScope(DRIVE_SCOPE);
provider.addScope(SHEETS_SCOPE);
provider.setCustomParameters({ prompt: "select_account" });
var driveAuthState = globalThis.__PCN_DRIVE_AUTH__ || (globalThis.__PCN_DRIVE_AUTH__ = {
	isSigningIn: false,
	cachedAccessToken: null,
	currentGoogleUser: null
});
var initDriveAuth = (onAuthSuccess, onAuthFailure) => {
	return onAuthStateChanged(auth, async (user) => {
		driveAuthState.currentGoogleUser = user;
		if (user && driveAuthState.cachedAccessToken) {
			if (onAuthSuccess) onAuthSuccess(user, driveAuthState.cachedAccessToken);
		} else {
			driveAuthState.cachedAccessToken = null;
			if (onAuthFailure) onAuthFailure();
		}
	});
};
var signInWithGoogleDrive = async () => {
	try {
		driveAuthState.isSigningIn = true;
		const authProvider = new GoogleAuthProvider();
		authProvider.addScope(DRIVE_SCOPE);
		authProvider.addScope(SHEETS_SCOPE);
		authProvider.setCustomParameters({ prompt: "select_account" });
		const result = await signInWithPopup(auth, authProvider);
		const credential = GoogleAuthProvider.credentialFromResult(result);
		if (!(credential === null || credential === void 0 ? void 0 : credential.accessToken)) throw new Error("গুগল ড্রাইভ অ্যাক্সেস টোকেন পাওয়া যায়নি");
		driveAuthState.cachedAccessToken = credential.accessToken;
		driveAuthState.currentGoogleUser = result.user;
		try {
			if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("protyasha-google-connected"));
		} catch {}
		return {
			user: result.user,
			accessToken: driveAuthState.cachedAccessToken
		};
	} catch (error) {
		console.error("Google Drive sign in error:", error);
		if ((error === null || error === void 0 ? void 0 : error.code) === "auth/unauthorized-domain") {
			const host = typeof window !== "undefined" ? window.location.hostname : "";
			throw new Error(`এই ডোমেইনটি (${host}) Firebase Authorized Domains-এ যুক্ত করা নেই। অ্যাডমিনকে Firebase Console -> Authentication -> Settings -> Authorized domains-এ "${host}" যুক্ত করতে বলুন।`);
		}
		throw error;
	} finally {
		driveAuthState.isSigningIn = false;
	}
};
var getDriveAccessToken = () => {
	return driveAuthState.cachedAccessToken;
};
var getConnectedGoogleUser = () => {
	return driveAuthState.currentGoogleUser || auth.currentUser;
};
var disconnectGoogleDrive = async () => {
	driveAuthState.cachedAccessToken = null;
	driveAuthState.currentGoogleUser = null;
	await auth.signOut();
};
/**
* Finds or creates the "Admin_Backups" folder in Google Drive
*/
async function getOrCreateBackupFolder(accessToken) {
	const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("name = 'Admin_Backups' and mimeType = 'application/vnd.google-apps.folder' and trashed = false")}&fields=files(id,name)`;
	const searchRes = await fetch(searchUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
	if (searchRes.ok) {
		const searchData = await searchRes.json();
		if (searchData.files && searchData.files.length > 0) return searchData.files[0].id;
	}
	const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			name: "Admin_Backups",
			mimeType: "application/vnd.google-apps.folder",
			description: "প্রত্যাশা ডিজিটাল পোর্টাল - ক্লাউড ডাটাবেস মাস্টার ব্যাকআপ ফোল্ডার"
		})
	});
	if (!createRes.ok) throw new Error("গুগল ড্রাইভে Admin_Backups ফোল্ডার তৈরি করা সম্ভব হয়নি");
	return (await createRes.json()).id;
}
/**
* Upload master backup JSON to Google Drive inside Admin_Backups
*/
async function uploadBackupToGoogleDrive(backupData, fileName) {
	const token = driveAuthState.cachedAccessToken;
	if (!token) throw new Error("গুগল ড্রাইভে লগইন করা নেই। অনুগ্রহ করে প্রথমে গুগল একাউন্ট কানেক্ট করুন।");
	const folderId = await getOrCreateBackupFolder(token);
	const now = /* @__PURE__ */ new Date();
	const dateStr = now.toISOString().split("T")[0];
	const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "-").slice(0, 5);
	const metadata = {
		name: fileName || `Protyasha_Master_Backup_${dateStr}_${timeStr}.json`,
		parents: [folderId],
		description: "প্রত্যাশা ক্যাবল নেটওয়ার্ক মাস্টার ক্লাউড ব্যাকআপ (Firebase Firestore + Accounts)",
		mimeType: "application/json"
	};
	const jsonContent = JSON.stringify(backupData, null, 2);
	const boundary = "-------314159265358979323846";
	const delimiter = `\r\n--${boundary}\r\n`;
	const closeDelimiter = `\r\n--${boundary}--`;
	const multipartRequestBody = delimiter + "Content-Type: application/json; charset=UTF-8\r\n\r\n" + JSON.stringify(metadata) + delimiter + "Content-Type: application/json\r\n\r\n" + jsonContent + closeDelimiter;
	const uploadRes = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,size,createdTime,webViewLink", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": `multipart/related; boundary=${boundary}`
		},
		body: multipartRequestBody
	});
	if (!uploadRes.ok) {
		const errText = await uploadRes.text();
		console.error("Drive upload failed:", errText);
		throw new Error(`গুগল ড্রাইভে ব্যাকআপ আপলোড ব্যর্থ হয়েছে (${uploadRes.status})`);
	}
	return await uploadRes.json();
}
/**
* List all backup files in Google Drive
*/
async function listGoogleDriveBackups() {
	const token = driveAuthState.cachedAccessToken;
	if (!token) throw new Error("গুগল ড্রাইভ কানেক্টেড নয়");
	const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent("trashed = false and (name contains 'Backup' or name contains 'backup' or mimeType = 'application/json')")}&fields=files(id,name,size,createdTime,modifiedTime,webViewLink)&orderBy=createdTime desc&pageSize=30`;
	const res = await fetch(url, { headers: { Authorization: `Bearer ${accessTokenHeader(token)}` } });
	if (!res.ok) {
		const err = await res.text();
		console.error("List backups failed:", err);
		throw new Error("ড্রাইভ থেকে ব্যাকআপ তালিকা আনা সম্ভব হয়নি");
	}
	return (await res.json()).files || [];
}
/**
* Download a backup file from Google Drive
*/
async function downloadGoogleDriveBackup(fileId) {
	const token = driveAuthState.cachedAccessToken;
	if (!token) throw new Error("গুগল ড্রাইভ কানেক্টেড নয়");
	const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) throw new Error("গুগল ড্রাইভ থেকে ফাইল ডাউনলোড করা সম্ভব হয়নি");
	const text = await res.text();
	try {
		return JSON.parse(text);
	} catch {
		throw new Error("ডাউনলোডকৃত ফাইলটি সঠিক JSON ফরম্যাটে নেই");
	}
}
/**
* Delete a backup file from Google Drive (Mandatory user confirmation required in UI)
*/
async function deleteGoogleDriveBackup(fileId) {
	const token = driveAuthState.cachedAccessToken;
	if (!token) throw new Error("গুগল ড্রাইভ কানেক্টেড নয়");
	return (await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` }
	})).ok;
}
function accessTokenHeader(token) {
	return token.replace(/^Bearer\s+/i, "");
}
//#endregion
export { DRIVE_SCOPE, SHEETS_SCOPE, deleteGoogleDriveBackup, disconnectGoogleDrive, downloadGoogleDriveBackup, getConnectedGoogleUser, getDriveAccessToken, getOrCreateBackupFolder, initDriveAuth, listGoogleDriveBackups, signInWithGoogleDrive, uploadBackupToGoogleDrive };
