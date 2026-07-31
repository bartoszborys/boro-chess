import type { Board } from "@/domain";

export interface BoardFactory {
    create(): Board;
}
