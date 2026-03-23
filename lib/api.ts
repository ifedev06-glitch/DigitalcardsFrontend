// src/app/lib/api.ts
import axios from "axios";
import { BACKEND_BASE_URL } from "@/lib/constatnt";
import { getToken } from "./auth";

// ---------- Axios instance ----------
const apiClient = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 30000,
});

// Interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userEmail");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// ================================================================
// ADMIN AUTH
// ================================================================

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  email: string;
  organizationSlug: string;
}

export async function adminLogin(
  request: AdminLoginRequest
): Promise<AdminLoginResponse> {
  const response = await apiClient.post<AdminLoginResponse>(
    "/auth/login",
    request
  );
  return response.data;
}

// ================================================================
// ORGANIZATION
// ================================================================

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  adminEmail: string;
  adminPassword: string;
}

export interface OrganizationResponse {
  id: number;
  name: string;
  slug: string;
  adminEmail: string;
}

export async function createOrganization(
  request: CreateOrganizationRequest,
  file: File
): Promise<OrganizationResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "data",
    new Blob([JSON.stringify(request)], {
      type: "application/json",
    })
  );

  const response = await apiClient.post<OrganizationResponse>(
    "/api/admin/organizations",
    formData
  );

  return response.data;
}
// ================================================================
// PROFILES
// ================================================================

export interface CreateProfileRequest {
  name: string
  role: string
  about?: string
  email?: string
  phoneNumber?: string
  instagramUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  youtubeUrl?: string
  tiktokUrl?: string
  whatsappUrl?: string
  websiteUrl?: string
  profilePictureUrl?: string
}

export interface ProfileResponse {
  id: number
  organizationName: string
  organizationSlug: string
  name: string
  role: string
  about: string
  email: string
  phoneNumber: string
  instagramUrl: string
  linkedinUrl: string
  twitterUrl: string
  youtubeUrl: string
  tiktokUrl: string
  whatsappUrl: string
  websiteUrl: string
  profilePictureUrl: string
  slug: string
  publicUrl: string
  viewCount: number
  organizationLogoUrl: string
}

export interface UpdateProfileRequest {
  name?: string;
  role?: string;
  instagramUrl?: string;
  linkedinUrl?: string;
  about?: string;
}

export async function createProfile(
  orgSlug: string,
  request: CreateProfileRequest
): Promise<ProfileResponse> {
  const response = await apiClient.post<ProfileResponse>(
    `/api/admin/${orgSlug}/profiles`,
    request
  );
  return response.data;
}

export async function getAllProfiles(
  orgSlug: string
): Promise<ProfileResponse[]> {
  const response = await apiClient.get<ProfileResponse[]>(
    `/api/admin/${orgSlug}/profiles`
  );
  return response.data;
}

export async function getProfileById(
  orgSlug: string,
  profileId: number
): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>(
    `/api/admin/${orgSlug}/profiles/${profileId}`
  );
  return response.data;
}

export async function updateProfile(
  orgSlug: string,
  profileId: number,
  request: UpdateProfileRequest
): Promise<ProfileResponse> {
  const response = await apiClient.put<ProfileResponse>(
    `/api/admin/${orgSlug}/profiles/${profileId}`,
    request
  );
  return response.data;
}

export async function deleteProfile(
  orgSlug: string,
  profileId: number
): Promise<void> {
  await apiClient.delete(`/api/admin/${orgSlug}/profiles/${profileId}`);
}

export async function getPublicProfile(
  orgSlug: string,
  profileSlug: string
): Promise<ProfileResponse> {
  const response = await apiClient.get<ProfileResponse>(
    `/public/${orgSlug}/${profileSlug}`
  );
  return response.data;
}

// ================================================================
// LEADS
// ================================================================

export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED";

export interface SubmitLeadRequest {
  name: string;
  email?: string;
  phoneNumber?: string;
  note?: string;
}

export interface UpdateLeadRequest {
  status?: LeadStatus;
  tags?: string;
  adminNotes?: string;
  followUpAt?: string; // ISO date string e.g. "2026-04-01T10:00:00"
}

export interface LeadResponse {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  note: string;
  profileName: string;
  profileSlug: string;
  organizationName: string;
  status: LeadStatus;
  tags: string;
  adminNotes: string;
  createdAt: string;
  followUpAt: string;
}

// PUBLIC — visitor submits info from a profile card
export async function submitLead(
  orgSlug: string,
  profileSlug: string,
  request: SubmitLeadRequest
): Promise<LeadResponse> {
  const response = await apiClient.post<LeadResponse>(
    `/public/${orgSlug}/${profileSlug}/leads`,
    request
  );
  return response.data;
}

// ADMIN — get all leads for org
export async function getLeads(orgSlug: string): Promise<LeadResponse[]> {
  const response = await apiClient.get<LeadResponse[]>(
    `/api/${orgSlug}/leads`
  );
  return response.data;
}

// ADMIN — filter leads by status
export async function getLeadsByStatus(
  orgSlug: string,
  status: LeadStatus
): Promise<LeadResponse[]> {
  const response = await apiClient.get<LeadResponse[]>(
    `/api/${orgSlug}/leads/status/${status}`
  );
  return response.data;
}

// ADMIN — get leads from a specific profile card
export async function getLeadsByProfile(
  orgSlug: string,
  profileId: number
): Promise<LeadResponse[]> {
  const response = await apiClient.get<LeadResponse[]>(
    `/api/${orgSlug}/leads/profile/${profileId}`
  );
  return response.data;
}

// ADMIN — update lead status / notes / tags
export async function updateLead(
  orgSlug: string,
  leadId: number,
  request: UpdateLeadRequest
): Promise<LeadResponse> {
  const response = await apiClient.patch<LeadResponse>(
    `/api/${orgSlug}/leads/${leadId}`,
    request
  );
  return response.data;
}

// ADMIN — delete a lead
export async function deleteLead(
  orgSlug: string,
  leadId: number
): Promise<void> {
  await apiClient.delete(`/api/${orgSlug}/leads/${leadId}`);
}

// ================================================================
// PROFILE STATS
// ================================================================

export interface ProfileStatsResponse {
  profileId: number
  profileName: string
  profileSlug: string
  role: string
  viewCount: number
  leadCount: number
  conversionRate: number
}

export async function getProfileStats(
  orgSlug: string
): Promise<ProfileStatsResponse[]> {
  const response = await apiClient.get<ProfileStatsResponse[]>(
    `/api/admin/${orgSlug}/profiles/stats`
  )
  return response.data
}

export default apiClient;