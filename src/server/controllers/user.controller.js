import userModule from '../modules/user.module';
import bcrypt from 'bcryptjs';//加密用
/**
 * User 資料表
 */

/*  User GET 取得  */
const userGet = (req, res) => {
  userModule.selectUser().then((result) => {
    res.send(result); // 成功回傳result結果
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

/* User  POST 新增 */
const userPost = (req, res) => {
  // 取得新增參數
  // const insertValues = req.body; //非加密寫法

  // 取得新增參數
  const hash = bcrypt.hashSync(req.body.user_password, 10);//定義加密
  const insertValues = {
    user_id: req.body.user_id,
    user_name: req.body.user_name,
    user_mail: req.body.user_mail,
    user_password: hash,// 密碼加密
    user_created_time: req.body.user_created_time,
    user_updated_time: req.body.user_updated_time
  };

  userModule.createUser(insertValues).then((result) => {
    res.send(result); // 成功回傳result結果
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

/* User PUT 修改 */
const userPut = (req, res) => {
  // 取得修改id
  const userId = req.params.user_id;
  // 取得修改參數
  const insertValues = req.body;
  userModule.modifyUser(insertValues, userId).then((result) => {
    res.send(result); // 回傳修改成功訊息
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

/* User  DELETE 刪除 */
const userDelete = (req, res) => {
  // 取得刪除id
  const userId = req.params.user_id;
  userModule.deleteUser(userId).then((result) => {
    res.send(result); // 回傳刪除成功訊息
  }).catch((err) => { return res.send(err); }); // 失敗回傳錯誤訊息
};

/* User GET(Login)登入取得資訊 */
const selectUserLogin = (insertValues) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((connectionError, connection) => {//資料庫連線
      if (connectionError) {
        reject(connectionError);//連線有問題則回傳錯誤
      }
      else {
        connection.query( //使用者撈取資料庫所有欄位的值
          'SELECT * FROM User where user_mail = ?',
          insertValues.user_mail, (error, result) => {
            if (eeor) {
              console.error('SQL error: ', error);
              reject(error); //寫入資料庫發現問題時回報錯誤
            }
            else if (Object.keys(result).length === 0) {
              resolve('信箱尚未註冊!');
            }
            else {
              const dbHasPassword = result[0].user_password;    //資料庫加密後的密碼
              const userPassword = insertValues.user_password;  //使用者登入後輸入的密碼
              bcrypt.compare(userPassword, dbHasPassword).then((res) => { //使用bcrtpt作解密驗證
                if (res) {
                  resolve('登入成功');
                }
                else {
                  resolve('您輸入的密碼有錯誤!');
                }
              });
            }
            connection.release();
          }
        );
      }
    });
  });
};

/* User POST登入(Login) */
const userLogin = (req, res)=>{
  //取得帳號密碼
  const insertValues = req.body;
  userModule.selectUserLogin(insertValues).then((result) =>{
    res.send(result); //成功回傳result結果
  }).catch((err) => {
    return res.send(err);
  });//失敗回傳錯誤訊息
};


export default {
  test,
  userGet,
  userPost,
  userPut,
  userDelete
};
