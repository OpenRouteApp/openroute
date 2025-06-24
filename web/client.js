import {
	UserServiceClient,
	ProposalServiceClient,
	RegisterUserReq,
	Uuid,
	CreateProposalReq,
	Route,
	VoteServiceClient,
} from "./dist/index.js";

const userClient = new UserServiceClient("http://localhost:8080");
const proposalClient = new ProposalServiceClient("http://localhost:8080");
const voteClient = new VoteServiceClient("http://localhost:8080");

// Register user
document.getElementById("registerBtn").addEventListener("click", () => {
	const username = document.getElementById("usernameInput").value;
	const req = new RegisterUserReq();
	req.setUsername(username);

	userClient.registerUser(req, {}, (err, res) => {
		const output = document.getElementById("registerResult");
		if (err) {
			output.textContent = "Error: " + err.message;
		} else {
			output.textContent = `User registered! ID: ${res.getId().getValue()}`;
		}
	});
});

// Get user
document.getElementById("getUserBtn").addEventListener("click", () => {
	const userId = document.getElementById("userIdInput").value;
	const req = new Uuid();
	req.setValue(userId);

	userClient.getUser(req, {}, (err, res) => {
		const output = document.getElementById("getUserResult");
		if (err) {
			output.textContent = "Error: " + err.message;
		} else {
			output.textContent = `User: ${res.getUsername()}`;
		}
	});
});

// Create proposal
document.getElementById("createProposalBtn").addEventListener("click", () => {
	const userId = document.getElementById("proposalUserId").value;
	const startLat = parseFloat(document.getElementById("startLat").value);
	const startLng = parseFloat(document.getElementById("startLng").value);
	const endLat = parseFloat(document.getElementById("endLat").value);
	const endLng = parseFloat(document.getElementById("endLng").value);

	const route = new Route();
	route.setStartLat(startLat);
	route.setStartLng(startLng);
	route.setEndLat(endLat);
	route.setEndLng(endLng);

	const userUuid = new Uuid();
	userUuid.setValue(userId);

	const req = new CreateProposalReq();
	req.setUserId(userUuid);
	req.setRoute(route);

	proposalClient.createProposal(req, {}, (err, res) => {
		const output = document.getElementById("proposalResult");
		if (err) {
			output.textContent = "Error: " + err.message;
		} else {
			output.textContent = `Proposal created! ID: ${res.getValue()}`;
		}
	});
});

// Get proposal
document.getElementById("getProposalBtn").addEventListener("click", () => {
	const proposalId = document.getElementById("proposalIdInput").value;
	const req = new Uuid();
	req.setValue(proposalId);

	proposalClient.getProposal(req, {}, (err, res) => {
		const output = document.getElementById("getProposalResult");
		if (err) {
			output.textContent = "Error: " + err.message;
		} else {
			const route = res.getRoute();
			output.textContent = `Proposal by user ${res.getUserId()} | Route: (${route.getStartLat()}, ${route.getStartLng()}) → (${route.getEndLat()}, ${route.getEndLng()}) | State: ${res.getState()}`;
		}
	});
});

document.getElementById("startBtn").addEventListener("click", () => {
	voteClient.start(new Uuid(), {}, (err, res) => {
		const output = document.getElementById("startResult");
		if (err) {
			output.textContent = "Error: " + err.message;
		} else {
			output.textContent = `Start returned value: ${res.getValue()}`;
		}
	});
});

document.getElementById("getRoutesBtn").addEventListener("click", () => {
	voteClient.getRoutes(new Uuid(), {}, (err, res) => {
		const output = document.getElementById("getRoutesResult");
		if (err) {
			output.textContent = "Error: " + err.message;
		} else {
			const routes = res.getRoutesList();
			if (!routes.length) {
				output.textContent = "No routes found.";
				return;
			}
			output.innerHTML = routes
				.map((r) => {
					return `(${r.getStartLat()}, ${r.getStartLng()}) → (${r.getEndLat()}, ${r.getEndLng()})`;
				})
				.join("<br>");
		}
	});
});
