import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DelProductModal from "../components/DelProductModal";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

// 預設的 Modal 狀態，用於新增或編輯時的表單初始化
const defaultModalState = {
  imageUrl: "",
  title: "",
  category: "",
  unit: "",
  origin_price: "",
  price: "",
  description: "",
  content: "",
  is_enabled: 0,
  imagesUrl: [""],
};

function ProductPage() {
  // 產品列表的狀態
  const [products, setProducts] = useState([]);

  //新增或編輯 Modal 的狀態
  const [modalMode, setModalMode] = useState(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const [isDelProductModalOpen, setIsDelProductModalOpen] = useState(false);

  // 從後端取得產品資料
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2/api/${API_PATH}/admin/products?page=${page}`
      );
      setProducts(res.data.products); // 更新產品列表
      setPageInfo(res.data.pagination); // 更新分頁資訊
    } catch (error) {
      alert("取得產品失敗");
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  // 開啟刪除產品的 Modal
  const handleOpenDelProductModal = (product) => {
    setTempProduct(product); // 設定當前要刪除的產品

    setIsDelProductModalOpen(true);
  };

  // 暫存產品的狀態
  const [tempProduct, setTempProduct] = useState(defaultModalState);

  // 開啟產品的新增或編輯 Modal
  const handleOpenProductModal = (mode, product) => {
    setModalMode(mode);

    switch (mode) {
      
      case "create":
        setTempProduct(defaultModalState); // 新增時重置狀態
        break;

      case "edit":
        setTempProduct(product); // 編輯時填入產品資料
        break;

      default:
        break;
    }

    setIsProductModalOpen(true);
  };

  const [pageInfo, setPageInfo] = useState({});

  const handlePageChange = (page) => {
    getProducts(page);
  };

  return (
    <>
      <div className="container py-5">
        <div className="row">
          <div className="col">
            <div className="d-flex justify-content-between">
              <h2>產品列表</h2>
              <button
                onClick={() => handleOpenProductModal("create")}
                type="button"
                className="btn btn-primary"
              >
                建立新的產品
              </button>
            </div>

            <table className="table">
              <thead>
                <tr>
                  <th scope="col">產品名稱</th>
                  <th scope="col">原價</th>
                  <th scope="col">售價</th>
                  <th scope="col">是否啟用</th>
                  <th scope="col">查看細節</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th scope="row">{product.title}</th>
                    <td>{product.origin_price}</td>
                    <td>{product.price}</td>
                    <td>
                      {product.is_enabled ? (
                        <span className="text-success">啟用</span>
                      ) : (
                        <span>未啟用</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          onClick={() =>
                            handleOpenProductModal("edit", product)
                          }
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                        >
                          編輯
                        </button>
                        <button
                          onClick={() => handleOpenDelProductModal(product)}
                          type="button"
                          className="btn btn-outline-danger btn-sm"
                        >
                          刪除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
      </div>

      <ProductModal
        tempProduct={tempProduct}
        getProducts={getProducts}
        modalMode={modalMode}
        isOpen={isProductModalOpen}
        setIsOpen={setIsProductModalOpen}
      />

      <DelProductModal
        tempProduct={tempProduct}
        isOpen={isDelProductModalOpen}
        setIsOpen={setIsDelProductModalOpen}
        getProducts={getProducts}
      />
    </>
  );
}

export default ProductPage;
