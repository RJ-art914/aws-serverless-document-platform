const config = {
  apiBaseUrl: "https://gm2c8nsyw2.execute-api.eu-central-1.amazonaws.com",
  cognitoLoginUrl: "",
  cognitoLogoutUrl: ""
};

const authStatusEl = document.getElementById("authStatus");
const userEmailEl = document.getElementById("userEmail");
const userGroupsEl = document.getElementById("userGroups");
const healthOutputEl = document.getElementById("healthOutput");
const tokenPreviewEl = document.getElementById("tokenPreview");
const submissionsOutputEl = document.getElementById("submissionsOutput");
const uploadOutputEl = document.getElementById("uploadOutput");
const statusOutputEl = document.getElementById("statusOutput");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const healthBtn = document.getElementById("healthBtn");
const loadSubmissionsBtn = document.getElementById("loadSubmissionsBtn");

const uploadForm = document.getElementById("uploadForm");
const documentTypeInput = document.getElementById("documentType");
const fileInput = document.getElementById("fileInput");

const statusForm = document.getElementById("statusForm");
const submissionIdInput = document.getElementById("submissionIdInput");
const statusSelect = document.getElementById("statusSelect");

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

function getTokensFromUrlHash() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);

  const idToken = params.get("id_token");
  const accessToken = params.get("access_token");

  if (idToken) {
    localStorage.setItem("id_token", idToken);
  }

  if (accessToken) {
    localStorage.setItem("access_token", accessToken);
  }

  if (idToken || accessToken) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

function getStoredIdToken() {
  return localStorage.getItem("id_token");
}

function updateAuthUi() {
  const idToken = getStoredIdToken();

  if (!idToken) {
    authStatusEl.textContent = "Not logged in";
    userEmailEl.textContent = "-";
    userGroupsEl.textContent = "-";
    tokenPreviewEl.textContent = "No token loaded.";
    return;
  }

  const payload = parseJwt(idToken);

  if (!payload) {
    authStatusEl.textContent = "Invalid token";
    userEmailEl.textContent = "-";
    userGroupsEl.textContent = "-";
    tokenPreviewEl.textContent = "Token exists but could not be parsed.";
    return;
  }

  authStatusEl.textContent = "Logged in";
  userEmailEl.textContent = payload.email || "-";

  const groups = payload["cognito:groups"];
  if (Array.isArray(groups)) {
    userGroupsEl.textContent = groups.join(", ");
  } else if (groups) {
    userGroupsEl.textContent = groups;
  } else {
    userGroupsEl.textContent = "-";
  }

  tokenPreviewEl.textContent = JSON.stringify(payload, null, 2);
}

async function checkHealth() {
  try {
    const response = await fetch(`${config.apiBaseUrl}/health`);
    const data = await response.json();
    healthOutputEl.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    healthOutputEl.textContent = `Health check failed: ${error.message}`;
  }
}

async function loadSubmissions() {
  const idToken = getStoredIdToken();

  if (!idToken) {
    submissionsOutputEl.textContent = "You must log in first.";
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/submissions`, {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    });

    const data = await response.json();
    submissionsOutputEl.textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    submissionsOutputEl.textContent = `Failed to load submissions: ${error.message}`;
  }
}

async function uploadDocument(event) {
  event.preventDefault();

  const idToken = getStoredIdToken();
  const documentType = documentTypeInput.value.trim();
  const file = fileInput.files[0];

  if (!idToken) {
    uploadOutputEl.textContent = "You must log in first.";
    return;
  }

  if (!documentType || !file) {
    uploadOutputEl.textContent = "Document type and file are required.";
    return;
  }

  try {
    uploadOutputEl.textContent = "Requesting upload URL...";

    const response = await fetch(`${config.apiBaseUrl}/upload-url`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        file_name: file.name,
        document_type: documentType
      })
    });

    const uploadData = await response.json();

    if (!response.ok) {
      uploadOutputEl.textContent = JSON.stringify(uploadData, null, 2);
      return;
    }

    uploadOutputEl.textContent = "Uploading file to S3...";

    const uploadResponse = await fetch(uploadData.upload_url, {
      method: "PUT",
      body: file
    });

    if (!uploadResponse.ok) {
      uploadOutputEl.textContent = `S3 upload failed with status ${uploadResponse.status}`;
      return;
    }

    uploadOutputEl.textContent = JSON.stringify({
      message: "Upload completed successfully",
      submission_id: uploadData.submission_id,
      s3_key: uploadData.s3_key
    }, null, 2);

    await loadSubmissions();
  } catch (error) {
    uploadOutputEl.textContent = `Upload failed: ${error.message}`;
  }
}

async function updateStatus(event) {
  event.preventDefault();

  const idToken = getStoredIdToken();
  const submissionId = submissionIdInput.value.trim();
  const status = statusSelect.value;

  if (!idToken) {
    statusOutputEl.textContent = "You must log in first.";
    return;
  }

  if (!submissionId) {
    statusOutputEl.textContent = "Submission ID is required.";
    return;
  }

  try {
    const response = await fetch(`${config.apiBaseUrl}/submissions/${submissionId}/status`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${idToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    const data = await response.json();
    statusOutputEl.textContent = JSON.stringify(data, null, 2);

    await loadSubmissions();
  } catch (error) {
    statusOutputEl.textContent = `Status update failed: ${error.message}`;
  }
}

async function loadRuntimeConfig() {
  const response = await fetch("config.json");
  const runtimeConfig = await response.json();
  config.cognitoLoginUrl = runtimeConfig.cognitoLoginUrl;
  config.cognitoLogoutUrl = runtimeConfig.cognitoLogoutUrl;
}

loginBtn.addEventListener("click", () => {
  window.location.href = config.cognitoLoginUrl;
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("id_token");
  localStorage.removeItem("access_token");
  window.location.href = config.cognitoLogoutUrl;
});

healthBtn.addEventListener("click", checkHealth);
loadSubmissionsBtn.addEventListener("click", loadSubmissions);
uploadForm.addEventListener("submit", uploadDocument);
statusForm.addEventListener("submit", updateStatus);

async function init() {
  await loadRuntimeConfig();
  getTokensFromUrlHash();
  updateAuthUi();
}

init();