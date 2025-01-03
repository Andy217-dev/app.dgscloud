import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

let initialState = {
  login: {
    data: [],
    isLoading: true,
  },
  isValid: {
    data: [],
    isLoading: true,
  },
  deposit: {
    data: {},
    isLoading: true,
  },
  sharedCpuAMD: {
    data: {},
    isLoading: true,
  },
  dashboard: {
    data: {},
    isLoading: true,
  },
  sharedCpuIntel: {
    data: {},
    isLoading: true,
  },
  cloudGPU: {
    data: {},
    isLoading: true,
  },
  dedicatedCpuGp: {
    data: {},
    isLoading: true,
  },
  dedicatedCpu: {
    data: {},
    isLoading: true,
  },
  dedicatedCpuMem: {
    data: {},
    isLoading: true,
  },
  dedicatedCpuStore: {
    data: {},
    isLoading: true,
  },
  bareMetalIntel: {
    data: {},
    isLoading: true,
  },
  bareMetalAmd: {
    data: {},
    isLoading: true,
  },
  withDraw: {
    data: {},
    isLoading: true,
  },
  showSummary: false,
};

export let login = createAsyncThunk("login", async (address, thunkAPI) => {
  try {
    let data = await fetch(
      `https://api.dcicloud.ai/login-wqed892q/${address}`,
      {
        method: "POST",
      }
    );
    data = await data?.json();
    return data;
  } catch (error) {
    return thunkAPI?.rejectWithValue("Login Failed");
  }
});

export let isValid = createAsyncThunk("isValid", async (encData, thunkAPI) => {
  try {
    let data = await fetch(`https://api.dcicloud.ai/customer-info/${encData}`, {
      method: "POST",
    });
    data = await data?.json();
    return data;
  } catch (error) {
    return thunkAPI?.rejectWithValue("Check Validation Failed");
  }
});

export let deposit = createAsyncThunk("deposit", async (id, thunkAPI) => {
  try {
    let data = await fetch(
      `https://api.dcicloud.ai/check-deposit-transaction/${id}`
    );
    data = await data?.json();
    return data;
  } catch (error) {
    return thunkAPI?.rejectWithValue("Deposit Failed");
  }
});

export let sharedCpuAMD = createAsyncThunk(
  "sharedCpuAMD",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/get-product/cloudcpu-amd`
      );
      data = await data?.json();
      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Shared CPU AMD Failed");
    }
  }
);

export let sharedCpuIntel = createAsyncThunk(
  "sharedCpuIntel",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/get-product/cloudcpu-intel`
      );
      data = await data?.json();
      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Shared CPU Intel Failed");
    }
  }
);

export let dedicatedCpuGp = createAsyncThunk(
  "dedicatedCpuGp",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/get-product/dedicated-gp`
      );
      data = await data?.json();

      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Dedicated Cpu Failed");
    }
  }
);
export let dedicatedCpu = createAsyncThunk(
  "dedicatedCpu",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/get-product/dedicated-cpu`
      );
      data = await data?.json();

      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Dedicated Cpu Failed");
    }
  }
);
export let dedicatedCpuMem = createAsyncThunk(
  "dedicatedCpuMem",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/get-product/dedicated-mem`
      );
      data = await data?.json();

      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Dedicated Cpu Failed");
    }
  }
);
export let dedicatedCpuStore = createAsyncThunk(
  "dedicatedCpuStore",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/get-product/dedicated-stor`
      );
      data = await data?.json();

      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Dedicated Cpu Failed");
    }
  }
);
export let bareMetalIntel = createAsyncThunk(
  "bareMetalIntel",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(`https://api.dcicloud.ai/get-product/bm-intel`);
      data = await data?.json();

      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Bare Metal Failed");
    }
  }
);
export let bareMetalAmd = createAsyncThunk(
  "bareMetalAmd",
  async (_, thunkAPI) => {
    try {
      let data = await fetch(`https://api.dcicloud.ai/get-product/bm-amd`);
      data = await data?.json();

      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Bare Metal Failed");
    }
  }
);
export let cloudGPU = createAsyncThunk("cloudGPU", async (_, thunkAPI) => {
  try {
    let data = await fetch(`https://api.dcicloud.ai/get-product/cloudgpu`);
    data = await data?.json();
    return data;
  } catch (error) {
    return thunkAPI?.rejectWithValue("Cloud GPU Failed");
  }
});

export let dashboard = createAsyncThunk(
  "dashboard",
  async (encdata, thunkAPI) => {
    try {
      let data = await fetch(`https://api.dcicloud.ai/my-servers/${encdata}`);
      data = await data?.json();
      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Failed Fetch Dashboard");
    }
  }
);

export let withDraw = createAsyncThunk(
  "withDraw",
  async ({ encdata, amount, address }, thunkAPI) => {
    try {
      let data = await fetch(
        `https://api.dcicloud.ai/withdraw-2rf378h/${encdata}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON?.stringify({
            amount,
            destination: address,
          }),
        }
      );
      data = await data?.json();
      return data;
    } catch (error) {
      return thunkAPI?.rejectWithValue("Withdraw Failed");
    }
  }
);

const DCloud = createSlice({
  name: "dcloud",
  initialState,
  reducers: {
    storeSummary: (state, action) => {
      state.showSummary = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login?.pending, (state) => {
        state.login.isLoading = true;
      })
      .addCase(login?.fulfilled, (state, { payload }) => {
        state.login.isLoading = false;
        state.login.data = payload;
      })
      .addCase(login?.rejected, (state) => {
        state.login.isLoading = false;
      });

    builder
      .addCase(isValid?.pending, (state) => {
        state.isValid.isLoading = true;
      })
      .addCase(isValid?.fulfilled, (state, { payload }) => {
        state.isValid.isLoading = false;
        state.isValid.data = payload;
      })
      .addCase(isValid?.rejected, (state, { payload }) => {
        state.isValid.isLoading = false;
        state.isValid.data = payload;
      });

    builder
      .addCase(deposit?.pending, (state) => {
        state.deposit.isLoading = true;
      })
      .addCase(deposit?.fulfilled, (state, { payload }) => {
        state.deposit.isLoading = false;
        state.deposit.data = payload;
      })
      .addCase(deposit?.rejected, (state, { payload }) => {
        state.deposit.isLoading = false;
        state.deposit.data = payload;
      });

    builder
      .addCase(sharedCpuAMD?.pending, (state) => {
        state.sharedCpuAMD.isLoading = true;
      })
      .addCase(sharedCpuAMD?.fulfilled, (state, { payload }) => {
        state.sharedCpuAMD.isLoading = false;
        state.sharedCpuAMD.data = payload;
      })
      .addCase(sharedCpuAMD?.rejected, (state, { payload }) => {
        state.sharedCpuAMD.isLoading = false;
        state.sharedCpuAMD.data = payload;
      });

    builder
      .addCase(cloudGPU?.pending, (state) => {
        state.cloudGPU.isLoading = true;
      })
      .addCase(cloudGPU?.fulfilled, (state, { payload }) => {
        state.cloudGPU.isLoading = false;
        state.cloudGPU.data = payload;
      })
      .addCase(cloudGPU?.rejected, (state, { payload }) => {
        state.cloudGPU.isLoading = false;
        state.cloudGPU.data = payload;
      });

    builder
      .addCase(sharedCpuIntel?.pending, (state) => {
        state.sharedCpuIntel.isLoading = true;
      })
      .addCase(sharedCpuIntel?.fulfilled, (state, { payload }) => {
        state.sharedCpuIntel.isLoading = false;
        state.sharedCpuIntel.data = payload;
      })
      .addCase(sharedCpuIntel?.rejected, (state, { payload }) => {
        state.sharedCpuIntel.isLoading = false;
        state.sharedCpuIntel.data = payload;
      });

    builder
      .addCase(dedicatedCpuGp?.pending, (state) => {
        state.dedicatedCpuGp.isLoading = true;
      })
      .addCase(dedicatedCpuGp?.fulfilled, (state, { payload }) => {
        state.dedicatedCpuGp.isLoading = false;
        state.dedicatedCpuGp.data = payload;
      })
      .addCase(dedicatedCpuGp?.rejected, (state, { payload }) => {
        state.dedicatedCpuGp.isLoading = false;
        state.dedicatedCpuGp.data = payload;
      });

    builder
      .addCase(dedicatedCpu?.pending, (state) => {
        state.dedicatedCpu.isLoading = true;
      })
      .addCase(dedicatedCpu?.fulfilled, (state, { payload }) => {
        state.dedicatedCpu.isLoading = false;
        state.dedicatedCpu.data = payload;
      })
      .addCase(dedicatedCpu?.rejected, (state, { payload }) => {
        state.dedicatedCpu.isLoading = false;
        state.dedicatedCpu.data = payload;
      });
    builder
      .addCase(dedicatedCpuMem?.pending, (state) => {
        state.dedicatedCpuMem.isLoading = true;
      })
      .addCase(dedicatedCpuMem?.fulfilled, (state, { payload }) => {
        state.dedicatedCpuMem.isLoading = false;
        state.dedicatedCpuMem.data = payload;
      })
      .addCase(dedicatedCpuMem?.rejected, (state, { payload }) => {
        state.dedicatedCpuMem.isLoading = false;
        state.dedicatedCpuMem.data = payload;
      });
    builder
      .addCase(dedicatedCpuStore?.pending, (state) => {
        state.dedicatedCpuStore.isLoading = true;
      })
      .addCase(dedicatedCpuStore?.fulfilled, (state, { payload }) => {
        state.dedicatedCpuStore.isLoading = false;
        state.dedicatedCpuStore.data = payload;
      })
      .addCase(dedicatedCpuStore?.rejected, (state, { payload }) => {
        state.dedicatedCpuStore.isLoading = false;
        state.dedicatedCpuStore.data = payload;
      });
    builder
      .addCase(bareMetalIntel?.pending, (state) => {
        state.bareMetalIntel.isLoading = true;
      })
      .addCase(bareMetalIntel?.fulfilled, (state, { payload }) => {
        state.bareMetalIntel.isLoading = false;
        state.bareMetalIntel.data = payload;
      })
      .addCase(bareMetalIntel?.rejected, (state, { payload }) => {
        state.bareMetalIntel.isLoading = false;
        state.bareMetalIntel.data = payload;
      });
    builder
      .addCase(bareMetalAmd?.pending, (state) => {
        state.bareMetalAmd.isLoading = true;
      })
      .addCase(bareMetalAmd?.fulfilled, (state, { payload }) => {
        state.bareMetalAmd.isLoading = false;
        state.bareMetalAmd.data = payload;
      })
      .addCase(bareMetalAmd?.rejected, (state, { payload }) => {
        state.bareMetalAmd.isLoading = false;
        state.bareMetalAmd.data = payload;
      });

    builder
      .addCase(dashboard?.pending, (state) => {
        state.dashboard.isLoading = true;
      })
      .addCase(dashboard?.fulfilled, (state, { payload }) => {
        state.dashboard.isLoading = false;
        state.dashboard.data = payload;
      })
      .addCase(dashboard?.rejected, (state, { payload }) => {
        state.dashboard.isLoading = false;
        state.dashboard.data = payload;
      });

    builder
      .addCase(withDraw?.pending, (state) => {
        state.withDraw.isLoading = true;
      })
      .addCase(withDraw?.fulfilled, (state, { payload }) => {
        state.withDraw.isLoading = false;
        state.withDraw.data = payload;
      })
      .addCase(withDraw?.rejected, (state, { payload }) => {
        state.withDraw.isLoading = false;
        state.withDraw.data = payload;
      });
  },
});

export let { storeSummary } = DCloud.actions;
export default DCloud.reducer;
