import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "../components/shared";

const BASE_PRODUCT = {
  id: "prod_001",
  title: "Classic V-Neck Tee",
  category: "Men",
  category_id: "cat_men",
  subcategory: "T-Shirts",
  price: 499,
  price_unit: "per piece",
  images: [],
  is_new: false,
  is_featured: false,
  in_stock: true,
  material: "100% Cotton",
  size: "XS to 3XL",
  description: "A comfortable tee",
  features: ["Soft fabric"],
  delivery_time: "5-7 days",
  min_quantity: 1,
  tags: ["men", "tshirt"],
  rating: 4.5,
  review_count: 10,
};

describe("ProductCard", () => {
  let openSpy;

  beforeEach(() => {
    openSpy = vi.spyOn(window, "open").mockImplementation(() => {});
  });

  it("renders product title", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    expect(screen.getByText(/Classic V-Neck Tee/i)).toBeInTheDocument();
  });

  it("renders formatted price", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    expect(screen.getByText(/499/)).toBeInTheDocument();
  });

  it("renders subcategory badge", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    expect(screen.getByText(/T-Shirts/i)).toBeInTheDocument();
  });

  it("does NOT show New badge when is_new is false", () => {
    render(<ProductCard product={{ ...BASE_PRODUCT, is_new: false }} onNavigate={vi.fn()} />);
    expect(screen.queryByText(/new/i)).not.toBeInTheDocument();
  });

  it("shows New badge when is_new is true", () => {
    render(<ProductCard product={{ ...BASE_PRODUCT, is_new: true }} onNavigate={vi.fn()} />);
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  it("Order Now button opens WhatsApp with the correct number", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    const btn = screen.getByRole("button", { name: /order on whatsapp/i });
    fireEvent.click(btn);
    expect(openSpy).toHaveBeenCalledOnce();
    const calledUrl = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain("wa.me/915468427200");
  });

  it("WhatsApp URL encodes product title in the message", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /order on whatsapp/i }));
    const calledUrl = openSpy.mock.calls[0][0];
    // Product title must appear URL-encoded in the query string
    expect(calledUrl).toContain(encodeURIComponent("Classic V-Neck Tee"));
  });

  it("WhatsApp URL contains category and subcategory", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /order on whatsapp/i }));
    const calledUrl = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain(encodeURIComponent("Men"));
    expect(calledUrl).toContain(encodeURIComponent("T-Shirts"));
  });

  it("WhatsApp URL contains price", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /order on whatsapp/i }));
    const calledUrl = openSpy.mock.calls[0][0];
    expect(calledUrl).toContain("499");
  });

  it("opens WhatsApp in a new tab", () => {
    render(<ProductCard product={BASE_PRODUCT} onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /order on whatsapp/i }));
    expect(openSpy.mock.calls[0][1]).toBe("_blank");
  });
});
