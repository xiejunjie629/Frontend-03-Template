学习笔记
### Http 请求
> 由请求行，请求头和请求体组成。
#### 实现一个 Http 请求
- Step1
  - 设计一个Http请求的类
  - Content-Type 为一个必要的字段（指明传输内容的格式）
  - body 是K-V 格式
  - 不同的Content-Type 影响 不同的 body 格式
- Step 2
  - 在Request的构造器中收集必要信息
  - 设计一个send函数，用于发送真实请求到服务端
  - send 函数应该是异步的，所以可以返回Promise
