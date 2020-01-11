import { reqMenuTree } from "../api/index";
import Converter from "../utils/ModelConverter";
const MenuService = {

  reqMenuTree: async () => {
    const result = await reqMenuTree();
    if (result.status === 0) {
      return result.data.map((x: any) => Converter.toMenu(x));
    }
  }
}

export default MenuService;