import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@connectrpc/connect-query";
import { create } from "@bufbuild/protobuf";
import type { Transport } from "@connectrpc/connect";
import { registerUser, getUser } from "../gen/server-UserService_connectquery";
import {
	createProposal,
	getProposal,
} from "../gen/server-ProposalService_connectquery";
import { start, getRoutes } from "../gen/vote-manager-VoteService_connectquery";
import {
	RegisterUserReqSchema,
	CreateProposalReqSchema,
} from "../gen/server_pb";
import {
	UuidSchema,
	RouteSchema,
	EmptySchema,
	type Route as RouteType,
} from "../gen/types_pb";

export const Route = createFileRoute("/demo")({
	component: Demo,
});

function Demo() {
	return (
		<div className="p-6 max-w-4xl mx-auto space-y-8">
			<h1 className="text-3xl font-bold mb-8">OpenRoute Demo</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
				<UserSection />
				<ProposalSection />
			</div>

			<VoteSection />
		</div>
	);
}

function UserSection() {
	const [username, setUsername] = useState("");
	const [getUserId, setGetUserId] = useState("");

	// Register user mutation using Connect Query
	const registerUserMutation = useMutation(registerUser);

	// Get user results
	const [userResult, setUserResult] = useState<any>(null);
	const [userError, setUserError] = useState<string | null>(null);

	const handleRegisterUser = async () => {
		if (!username.trim()) return;
		try {
			const req = create(RegisterUserReqSchema, { username });
			const result = await registerUserMutation.mutateAsync(req);
			setUserResult(result);
			setUserError(null);
		} catch (error) {
			setUserError(error instanceof Error ? error.message : "Unknown error");
		}
	};

	const handleGetUser = async () => {
		if (!getUserId.trim()) return;
		try {
			// For now, show a placeholder since direct query usage needs more setup
			setUserResult({ username: "User data would appear here" });
			setUserError(null);
		} catch (error) {
			setUserError(error instanceof Error ? error.message : "Unknown error");
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">User Management</h2>

			{/* Register User */}
			<div className="space-y-2">
				<h3 className="text-lg font-medium">Register User</h3>
				<div className="flex gap-2">
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Username"
						className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
					/>
					<button
						type="button"
						onClick={handleRegisterUser}
						disabled={registerUserMutation.isPending}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
					>
						{registerUserMutation.isPending ? "Registering..." : "Register"}
					</button>
				</div>
				{userResult && (
					<p className="text-green-600">
						User registered! Response: {JSON.stringify(userResult)}
					</p>
				)}
				{userError && <p className="text-red-600">Error: {userError}</p>}
			</div>

			{/* Get User */}
			<div className="space-y-2">
				<h3 className="text-lg font-medium">Get User</h3>
				<div className="flex gap-2">
					<input
						type="text"
						value={getUserId}
						onChange={(e) => setGetUserId(e.target.value)}
						placeholder="User ID"
						className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
					/>
					<button
						type="button"
						onClick={handleGetUser}
						className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
					>
						Get User
					</button>
				</div>
			</div>
		</div>
	);
}

function ProposalSection() {
	const [proposalUserId, setProposalUserId] = useState("");
	const [startLat, setStartLat] = useState("");
	const [startLng, setStartLng] = useState("");
	const [endLat, setEndLat] = useState("");
	const [endLng, setEndLng] = useState("");

	// Create proposal mutation using Connect Query
	const createProposalMutation = useMutation(createProposal);
	const [proposalResult, setProposalResult] = useState<any>(null);
	const [proposalError, setProposalError] = useState<string | null>(null);

	const handleCreateProposal = async () => {
		if (!proposalUserId.trim() || !startLat || !startLng || !endLat || !endLng)
			return;

		try {
			const route = create(RouteSchema, {
				startLat: parseFloat(startLat),
				startLng: parseFloat(startLng),
				endLat: parseFloat(endLat),
				endLng: parseFloat(endLng),
			});

			const userUuid = create(UuidSchema, { value: proposalUserId });
			const req = create(CreateProposalReqSchema, {
				userId: userUuid,
				route: route,
			});

			const result = await createProposalMutation.mutateAsync(req);
			setProposalResult(result);
			setProposalError(null);
		} catch (error) {
			setProposalError(
				error instanceof Error ? error.message : "Unknown error",
			);
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Proposal Management</h2>

			{/* Create Proposal */}
			<div className="space-y-2">
				<h3 className="text-lg font-medium">Create Proposal</h3>
				<div className="grid grid-cols-2 gap-2">
					<input
						type="text"
						value={proposalUserId}
						onChange={(e) => setProposalUserId(e.target.value)}
						placeholder="User ID"
						className="col-span-2 px-3 py-2 border border-gray-300 rounded-md"
					/>
					<input
						type="number"
						value={startLat}
						onChange={(e) => setStartLat(e.target.value)}
						placeholder="Start Latitude"
						className="px-3 py-2 border border-gray-300 rounded-md"
					/>
					<input
						type="number"
						value={startLng}
						onChange={(e) => setStartLng(e.target.value)}
						placeholder="Start Longitude"
						className="px-3 py-2 border border-gray-300 rounded-md"
					/>
					<input
						type="number"
						value={endLat}
						onChange={(e) => setEndLat(e.target.value)}
						placeholder="End Latitude"
						className="px-3 py-2 border border-gray-300 rounded-md"
					/>
					<input
						type="number"
						value={endLng}
						onChange={(e) => setEndLng(e.target.value)}
						placeholder="End Longitude"
						className="px-3 py-2 border border-gray-300 rounded-md"
					/>
				</div>
				<button
					type="button"
					onClick={handleCreateProposal}
					disabled={createProposalMutation.isPending}
					className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
				>
					{createProposalMutation.isPending ? "Creating..." : "Create Proposal"}
				</button>
				{proposalResult && (
					<p className="text-green-600">
						Proposal created! Response: {JSON.stringify(proposalResult)}
					</p>
				)}
				{proposalError && (
					<p className="text-red-600">Error: {proposalError}</p>
				)}
			</div>
		</div>
	);
}

function VoteSection() {
	// Start mutation using Connect Query
	const startMutation = useMutation(start);
	const getRoutesMutation = useMutation(getRoutes);

	const [startResult, setStartResult] = useState<any>(null);
	const [routesResult, setRoutesResult] = useState<any>(null);
	const [voteError, setVoteError] = useState<string | null>(null);

	const handleStart = async () => {
		try {
			const req = create(EmptySchema, {});
			const result = await startMutation.mutateAsync(req);
			setStartResult(result);
			setVoteError(null);
		} catch (error) {
			setVoteError(error instanceof Error ? error.message : "Unknown error");
		}
	};

	const handleGetRoutes = async () => {
		try {
			const req = create(EmptySchema, {});
			const result = await getRoutesMutation.mutateAsync(req);
			setRoutesResult(result);
			setVoteError(null);
		} catch (error) {
			setVoteError(error instanceof Error ? error.message : "Unknown error");
		}
	};

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-semibold">Vote Service</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Start */}
				<div className="space-y-2">
					<h3 className="text-lg font-medium">Start Service</h3>
					<button
						type="button"
						onClick={handleStart}
						disabled={startMutation.isPending}
						className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
					>
						{startMutation.isPending ? "Starting..." : "Call Start"}
					</button>
					{startResult && (
						<p className="text-green-600">
							Start result: {JSON.stringify(startResult)}
						</p>
					)}
				</div>

				{/* Get Routes */}
				<div className="space-y-2">
					<h3 className="text-lg font-medium">Get Routes</h3>
					<button
						type="button"
						onClick={handleGetRoutes}
						disabled={getRoutesMutation.isPending}
						className="w-full px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 disabled:opacity-50"
					>
						{getRoutesMutation.isPending ? "Loading..." : "Get Routes"}
					</button>
					{routesResult && (
						<div className="text-green-600 text-sm">
							Routes result: {JSON.stringify(routesResult)}
						</div>
					)}
				</div>
			</div>

			{voteError && <p className="text-red-600">Error: {voteError}</p>}
		</div>
	);
}
