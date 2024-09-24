import React, { useEffect, useState } from "react";
import "./Admin.css"; // Ensure your CSS file is linked for styles
import Select from "react-select";

const AdminPage = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [newCategoryQuantity, setNewCategoryQuantity] = useState(1);
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");
  const [updatedCategoryImage, setUpdatedCategoryImage] = useState(null);
  const [newDish, setNewDish] = useState({
    name: "",
    categoryId: "",
    quantity: 1,
    price: "",
  });
  const [newSupplier, setNewSupplier] = useState("");
  const [newInventory, setNewInventory] = useState({
    name: "",
    quantity: 1,
    expiry: "",
  });
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [error, setError] = useState("");
  const [activeSection, setActiveSection] = useState("categories");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    fetchCategories();
    fetchDishes();
    fetchSuppliers();
    fetchInventoryItems();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/category/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setCategories(Array.isArray(result.data) ? result.data : []);
      } else {
        throw new Error("Failed to fetch categories");
      }
    } catch (error) {
      setError("Could not fetch categories, please try again later.");
    }
  };

  const fetchDishes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/dish/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setDishes(Array.isArray(result.data) ? result.data : []);
      } else {
        throw new Error("Failed to fetch dishes");
      }
    } catch (error) {
      setError("Could not fetch dishes, please try again later.");
    }
  };

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/supplier/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setSuppliers(Array.isArray(result.data) ? result.data : []);
      } else {
        throw new Error("Failed to fetch suppliers");
      }
    } catch (error) {
      setError("Could not fetch suppliers, please try again later.");
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/inventory/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        setInventoryItems(Array.isArray(result.data) ? result.data : []);
      } else {
        throw new Error("Failed to fetch inventory items");
      }
    } catch (error) {
      setError("Could not fetch inventory items, please try again later.");
    }
  };

  const handleAddCategory = async () => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    const requestBody = new FormData();
    requestBody.append("name", newCategory);
    requestBody.append("quantity", newCategoryQuantity);
    requestBody.append("user_id", userId);
    if (newCategoryImage) {
      requestBody.append("image", newCategoryImage);
    }

    try {
      const response = await fetch(`${BASE_URL}/category/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: requestBody,
      });

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(
          `Failed to create category: ${JSON.stringify(responseData)}`
        );
      }

      setNewCategory("");
      setNewCategoryImage(null);
      fetchCategories();
    } catch (error) {
      setError("Failed to create category. Please try again.");
    }
  };

  const handleUpdateCategory = async (categoryId) => {
    const token = localStorage.getItem("token");
    const requestBody = new FormData();

    requestBody.append("name", updatedCategoryName);
    if (updatedCategoryImage) {
      requestBody.append("image", updatedCategoryImage); // Include new image
    }

    try {
      const response = await fetch(
        `${BASE_URL}/category/update/${categoryId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: requestBody,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(`Failed to update category: ${errorResponse.message}`);
      }

      fetchCategories(); // Refresh categories to reflect changes
      setUpdatedCategoryName(""); // Clear input after update
      setUpdatedCategoryImage(null); // Reset image after update
      setSelectedCategory(null); // Clear selected category
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddDish = async () => {
    const { name, categoryId, quantity, price } = newDish;

    if (!name.trim() || !categoryId || !price) {
      setError("Dish name, category, and price must be specified.");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const requestBody = {
      name,
      category_id: categoryId,
      quantity,
      price,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/dish/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchDishes();
        setNewDish({ name: "", categoryId: "", quantity: 1, price: "" });
      } else {
        const responseText = await response.text();
        throw new Error(`Failed to create dish: ${responseText}`);
      }
    } catch (error) {
      setError("Could not add dish, please try again.");
    }
  };

  const handleAddSupplier = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!newSupplier.trim()) {
      setError("Supplier name must be specified.");
      return;
    }

    const requestBody = {
      name: newSupplier,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/supplier/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        fetchSuppliers();
        setNewSupplier("");
      } else {
        const responseText = await response.text();
        throw new Error(`Failed to create supplier: ${responseText}`);
      }
    } catch (error) {
      setError("Could not add supplier, please try again.");
    }
  };

  const handleAddInventory = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (
      !newInventory.name.trim() ||
      !newInventory.quantity ||
      !newInventory.expiry ||
      !selectedSupplier
    ) {
      setError(
        "Inventory name, quantity, expiry date, and supplier must be specified."
      );
      return;
    }

    const requestBody = {
      name: newInventory.name,
      quantity: newInventory.quantity,
      expiry: newInventory.expiry,
      user_id: userId,
    };

    try {
      const response = await fetch(`${BASE_URL}/inventory/store`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();

      if (response.ok) {
        const inventoryId =
          responseData.id || responseData.data?.id || responseData.inventoryId;

        if (!inventoryId) {
          throw new Error("Inventory ID is not returned");
        }

        const supplierId = selectedSupplier.value;
        await attachSupplierToInventory(inventoryId, supplierId);
        fetchInventoryItems();
        setNewInventory({ name: "", quantity: 1, expiry: "" });
        setSelectedSupplier(null);
      } else {
        const responseText = await response.text();
        throw new Error(`Failed to create inventory item: ${responseText}`);
      }
    } catch (error) {
      setError(
        "Could not add inventory item and attach supplier, please try again."
      );
    }
  };

  const attachSupplierToInventory = async (inventoryId, supplierId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BASE_URL}/inventory_supplier/inventories/${inventoryId}/suppliers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ supplier_ids: [supplierId] }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to attach supplier: ${errorText}`);
      }
    } catch (error) {
      throw error; // Rethrow to handle further up in the call chain
    }
  };

  const handleDeleteInventory = async (id) => {
    try {
      const supplierIds = await getSupplierIdsForInventory(id);
      if (supplierIds.length > 0) {
        await detachSupplierFromInventory(id, supplierIds);
      }

      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/inventory/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchInventoryItems();
      } else {
        throw new Error("Failed to delete inventory item");
      }
    } catch (error) {
      setError("Could not delete inventory item, please try again.");
    }
  };

  const detachSupplierFromInventory = async (inventoryId, supplierIds) => {
    const token = localStorage.getItem("token");

    if (!supplierIds || supplierIds.length === 0) {
      return; // Exit if no supplier IDs are available
    }

    const body = JSON.stringify({ supplier_ids: supplierIds });

    try {
      const response = await fetch(
        `${BASE_URL}/inventory_supplier/inventories/${inventoryId}/suppliers`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: body,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to detach supplier from inventory: ${errorText}`
        );
      }
    } catch (error) {
      setError("Could not detach supplier from inventory, please try again.");
    }
  };

  const getSupplierIdsForInventory = async (inventoryId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${BASE_URL}/inventory_supplier/inventories/${inventoryId}/suppliers`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data?.data?.map((supplier) => supplier.id) || [];
      } else {
        return [];
      }
    } catch (error) {
      return [];
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/category/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchCategories();
      } else {
        throw new Error("Failed to delete category");
      }
    } catch (error) {
      setError("Could not delete category, please try again.");
    }
  };

  const handleDeleteDish = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/dish/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchDishes();
      } else {
        throw new Error("Failed to delete dish");
      }
    } catch (error) {
      setError("Could not delete dish, please try again.");
    }
  };

  const handleDeleteSupplier = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_URL}/supplier/destroy/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        fetchSuppliers();
      } else {
        throw new Error("Failed to delete supplier");
      }
    } catch (error) {
      setError("Could not delete supplier, please try again.");
    }
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case "categories":
        return (
          <section className="cat-section">
            <h2>Manage Categories</h2>
            <h3>Existing Categories</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  {category.name}
                  <button
                    onClick={() => {
                      setSelectedCategory(category);
                      setUpdatedCategoryName(category.name); // Load existing category name
                      setUpdatedCategoryImage(null); // Reset image on select
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h2>Enter a new Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New Category"
            />
            <h4>Enter Quantity</h4>
            <input
              type="number"
              value={newCategoryQuantity}
              min="1"
              onChange={(e) => setNewCategoryQuantity(e.target.value)}
              placeholder="Quantity"
            />
            <h4>Upload Image</h4>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewCategoryImage(e.target.files[0])}
            />

            {selectedCategory && (
              <div>
                <h2>Update Category: {selectedCategory.name}</h2>
                <input
                  type="text"
                  value={updatedCategoryName}
                  onChange={(e) => setUpdatedCategoryName(e.target.value)}
                  placeholder="Update Category Name"
                />
                <h4>Upload New Image</h4>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUpdatedCategoryImage(e.target.files[0])} // New image handling
                />
                <button
                  onClick={() => handleUpdateCategory(selectedCategory.id)}
                >
                  Update Category
                </button>
              </div>
            )}
            <button onClick={handleAddCategory}>Add Category</button>
          </section>
        );
      case "dishes":
        return (
          <section className="dish-section">
            <h2>Manage Dishes</h2>
            <h3>Existing Dishes</h3>
            <ul>
              {dishes.map((dish) => (
                <li key={dish.id}>
                  {dish.name} (Category: {dish.category.name}){" "}
                  <button onClick={() => handleDeleteDish(dish.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h3>Add a new Dish</h3>
            <input
              type="text"
              value={newDish.name}
              placeholder="Dish Name"
              onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
            />
            <select
              value={newDish.categoryId}
              onChange={(e) =>
                setNewDish({ ...newDish, categoryId: e.target.value })
              }
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <h4>Enter Quantity</h4>
            <input
              type="number"
              value={newDish.quantity}
              min="1"
              onChange={(e) =>
                setNewDish({ ...newDish, quantity: e.target.value })
              }
              placeholder="Quantity"
            />
            <h4>Enter Price</h4>
            <input
              type="number"
              value={newDish.price}
              min="0"
              onChange={(e) =>
                setNewDish({ ...newDish, price: e.target.value })
              }
              placeholder="Price"
            />
            <button onClick={handleAddDish}>Add Dish</button>
          </section>
        );
      case "suppliers":
        return (
          <section className="supplier-section">
            <h2>Manage Suppliers</h2>
            <h3>Existing Suppliers</h3>
            <ul>
              {suppliers.map((supplier) => (
                <li key={supplier.id}>
                  {supplier.name}
                  <button onClick={() => handleDeleteSupplier(supplier.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h4>Add a supplier</h4>
            <input
              type="text"
              value={newSupplier}
              onChange={(e) => setNewSupplier(e.target.value)}
              placeholder="New Supplier"
            />
            <button onClick={handleAddSupplier}>Add Supplier</button>
          </section>
        );
      case "inventory":
        return (
          <section className="inventory-section">
            <h2>Manage Inventory</h2>
            <h3>Existing Inventory Items</h3>
            <ul>
              {inventoryItems.map((item) => (
                <li key={item.id}>
                  {item.name}
                  <button onClick={() => handleDeleteInventory(item.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h3>Add a new Inventory Item</h3>
            <input
              type="text"
              value={newInventory.name}
              onChange={(e) =>
                setNewInventory({ ...newInventory, name: e.target.value })
              }
              placeholder="Inventory Name"
            />
            <h4>Enter a Quantity</h4>
            <input
              type="number"
              value={newInventory.quantity}
              min="1"
              onChange={(e) =>
                setNewInventory({ ...newInventory, quantity: e.target.value })
              }
              placeholder="Quantity"
            />
            <h4>Enter Expiry Date</h4>
            <input
              type="date"
              value={newInventory.expiry}
              onChange={(e) =>
                setNewInventory({ ...newInventory, expiry: e.target.value })
              }
            />
            <h4>Select a Supplier</h4>
            <Select
              className="supplier-select"
              options={suppliers.map((supplier) => ({
                value: supplier.id,
                label: supplier.name,
              }))}
              onChange={setSelectedSupplier}
              placeholder="Choose a supplier..."
              isClearable
            />
            <button onClick={handleAddInventory}>Add Inventory</button>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <h1>Admin Page</h1>
      {error && <p className="error">{error}</p>}

      <nav className="navbar">
        <button onClick={() => setActiveSection("categories")}>
          Categories
        </button>
        <button onClick={() => setActiveSection("dishes")}>Dishes</button>
        <button onClick={() => setActiveSection("suppliers")}>Suppliers</button>
        <button onClick={() => setActiveSection("inventory")}>Inventory</button>
      </nav>

      {renderActiveSection()}
    </div>
  );
};

export default AdminPage;
