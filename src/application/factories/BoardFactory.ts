import type { Board } from "@/domain";

export interface BoardFactory {
    get(): Board;
}
