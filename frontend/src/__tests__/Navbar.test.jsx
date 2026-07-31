import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/layout/Navbar";

// Mock the entire AuthContext module so we don't need a real provider
vi.mock("../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "categories", label: "Categories" },
];

function renderNavbar(authValue) {
  useAuth.mockReturnValue(authValue);
  return render(
    <Navbar
      activePage="home"
      navItems={NAV_ITEMS}
      onNavigate={vi.fn()}
    />
  );
}

describe("Navbar", () => {
  describe("guest (not authenticated)", () => {
    beforeEach(() => {
      renderNavbar({ user: null, isAuthenticated: false, isAdmin: false, logout: vi.fn() });
    });

    it('shows "Login" button', () => {
      expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it('does not show "Logout"', () => {
      expect(screen.queryByRole("button", { name: /logout/i })).not.toBeInTheDocument();
    });

    it("does not show Admin link", () => {
      expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
    });
  });

  describe("customer (authenticated, not admin)", () => {
    beforeEach(() => {
      renderNavbar({
        user: { name: "Ayush Mohit", role: "customer" },
        isAuthenticated: true,
        isAdmin: false,
        logout: vi.fn(),
      });
    });

    it("shows user first name", () => {
      expect(screen.getByText(/Hi, Ayush/i)).toBeInTheDocument();
    });

    it("shows Logout button", () => {
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("does not show Login button", () => {
      expect(screen.queryByRole("button", { name: /^login$/i })).not.toBeInTheDocument();
    });

    it("does not show Admin button", () => {
      expect(screen.queryByRole("button", { name: /admin/i })).not.toBeInTheDocument();
    });
  });

  describe("admin", () => {
    beforeEach(() => {
      renderNavbar({
        user: { name: "Admin User", role: "admin" },
        isAuthenticated: true,
        isAdmin: true,
        logout: vi.fn(),
      });
    });

    it("shows Admin button", () => {
      expect(screen.getByRole("button", { name: /admin/i })).toBeInTheDocument();
    });

    it("shows Logout button", () => {
      expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
    });

    it("does not show Login button", () => {
      expect(screen.queryByRole("button", { name: /^login$/i })).not.toBeInTheDocument();
    });
  });
});
