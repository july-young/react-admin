import { reqMenuTree } from "../api/index";
import converter2Menu from "../converter/converter2Menu";
const MenuService = {

  reqMenuTree: async () => {
    const result = await reqMenuTree();
    if (result.status === 0) {
      return result.data.map((x: any) => converter2Menu(x));
    }
  }
}

export default MenuService;